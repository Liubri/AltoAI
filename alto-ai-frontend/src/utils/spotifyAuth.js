import axios from "axios";
import { setToken } from "../redux/spotifySlice";
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Step 1 — Redirect to Spotify login
export function spotifyLogin() {
  const scope = "playlist-modify-public playlist-modify-private";
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: "http://127.0.0.1:5173/callback",
    });
  console.log("WindowHREF:", window.location.origin);
  window.location.href = authUrl
}
// Step 2 — Handle Spotify callback
export async function spotifyCallback(code) {
  if (!code) {
    spotifyLogin()
  }
  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://127.0.0.1:5173/callback",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
        },
      }
    );
    console.log("Callback: ", window.location.origin + "/callback");
    console.log("Token response data:",  "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),); // Debug log

    const { access_token, refresh_token } = tokenResponse.data;
    return refresh_token
    
    //console.log("Access token:", access_token);
    //console.log("Refresh token:", refresh_token);

    // Get user profile
    // const userRes = await spotifyApi.get("/v1/me", {
    //   headers: { Authorization: `Bearer ${access_token}` },
    // });

    // console.log("Logged in user:", userRes.data.display_name);

    console.log("✅ Login successful! Check console for tokens and user info.");
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

// Helper to refresh access token
export async function getAccessToken(refreshToken) {
  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
      },
    }
  );
  return res.data.access_token;
}