import express from "express";
import cors from "cors";
import { getAIRequest, generatePlaylist } from "./ai.js";
import dotenv from "dotenv";
import { spotifyCallback, spotifyLogin, getAccessToken } from "./spotifyAuth.js";
import { checkValidSongs } from "./spotify.js";

dotenv.config();
const app = express();
app.use(cors()); // allow frontend requests
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js!" });
});
const songs = [
  { title: "怪物", artist: "YOASOBI" },
  { title: "アイドル", artist: "YOASOBI" },
  { title: "群青", artist: "YOASOBI" },
  { title: "夜に駆ける", artist: "YOASOBI" },
  { title: "告白氣球", artist: "" },
];
app.get("/spotify/createPlaylist", async (req, res) => {
  try {
    //const prompt = req.query.prompt;
    //const playlist = await generatePlaylist(prompt);
    //console.log("🎵 Generated playlist for Spotify:", playlist);

    await checkValidSongs(songs);

    res.status(200).send("✅ Playlist created and songs added!");
  } catch (err) {
    console.error("Error in /createPlaylist:", err);
    res.status(500).send("❌ Failed to create playlist.");
  }
});

app.get("/api/openai", getAIRequest);

app.get("/spotify/login", spotifyLogin);

app.get("/callback", spotifyCallback);

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
