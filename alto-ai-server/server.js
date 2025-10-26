import express from "express";
import cors from "cors";
import { getAIRequest, generatePlaylist } from "./openrouter.js";
import dotenv from "dotenv";
import { spotifyCallback, spotifyLogin, requireAuth } from "./spotify/spotifyAuth.js";
import { checkValidSongs } from "./spotify/spotify.js";
import connectDB from "./models/db.js";
import {createPlaylistRoute} from "./spotify/routes.js";

dotenv.config();
const app = express();
app.use(cors()); // allow frontend requests
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js!" });
});
// const songs = [
//   { title: "怪物", artist: "YOASOBI" },
//   { title: "アイドル", artist: "YOASOBI" },
//   { title: "群青", artist: "YOASOBI" },
//   { title: "夜に駆ける", artist: "YOASOBI" },
//   { title: "告白氣球", artist: "" },
// ];
app.post("/spotify/createPlaylist", requireAuth(createPlaylistRoute));

app.get("/api/openai", requireAuth(getAIRequest));

app.get("/spotify/login", spotifyLogin);

app.get("/callback", spotifyCallback);

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
