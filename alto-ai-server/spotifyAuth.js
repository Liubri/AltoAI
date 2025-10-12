import axios from "axios";
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Step 1 — Redirect to Spotify login
export function spotifyLogin(req, res) {
  const scope = "playlist-modify-public playlist-modify-private";
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
    });

  res.redirect(authUrl);
}
// Step 2 — Handle Spotify callback
export async function spotifyCallback(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code received");

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    global.SPOTIFY_REFRESH_TOKEN = refresh_token;

    //console.log("Access token:", access_token);
    //console.log("Refresh token:", refresh_token);

    // Get user profile
    const userRes = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log("Logged in user:", userRes.data.display_name);

    res.send("✅ Login successful! Check console for tokens and user info.");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error during Spotify callback");
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