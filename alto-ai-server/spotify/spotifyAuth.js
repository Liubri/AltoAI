import axios from "axios";
import dotenv from "dotenv";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

dotenv.config()
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const SECRET_KEY = process.env.JWT_SECRET;  


// Step 1 — Redirect to Spotify login
export function spotifyLogin(req, res) {
  const scope = "playlist-modify-public playlist-modify-private";
  const REDIRECT_URL = `${req.protocol}://${req.get("host")}/callback`;
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URL,
    });
  res.redirect(authUrl);
}
// Step 2 — Handle Spotify callback
export async function spotifyCallback(req, res) {
  const REDIRECT_URL = `${req.protocol}://${req.get("host")}/callback`;
  const code = req.query.code;

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        code,
        redirect_uri: REDIRECT_URL,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = tokenRes.data;
    console.log("Access Token:", access_token);

    // Fetch user info from Spotify
    const meRes = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = meRes.data;

    // Upsert user into MongoDB
    const user = await User.findOneAndUpdate(
      { spotifyId: userData.id },
      {
        username: userData.display_name,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    // Create your JWT for your own session
    const jwtToken = jwt.sign(
      { userId: user._id, spotifyId: user.spotifyId },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.redirect(FRONTEND_URL + "login?token=" + jwtToken);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("OAuth error");
  }
}

export async function updateAccessToken(user) {
  if (new Date() < user.tokenExpiresAt) return;

  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: user.refreshToken,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
      },
    }
  );

  user.accessToken = res.data.access_token;
  user.tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
}

export async function getUserFromToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (err) {
    console.error("Invalid JWT:", err.message);
    throw err; // let the caller handle sending 401
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];

    try {
      const user = await getUserFromToken(token);
      // pass the user to the handler
      return await handler(req, res, user);
    } catch (err) {
      return res.status(401).send("Invalid or expired token");
    }
  };
}