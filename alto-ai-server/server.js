import express from "express";
import cors from "cors";
import { getAIRequest } from "./ai/ai.js";
import dotenv from "dotenv";
import { spotifyCallback, spotifyLogin, requireAuth } from "./spotify/spotifyAuth.js";
import connectDB from "./models/db.js";
import { createPlaylistRoute, exportToSpotify} from "./spotify/routes.js";
import { historyRoute, getPlaylistRoute, deletePlaylistRoute } from "./playlist/routes.js";
import { deleteSongRoute } from "./song/routes.js";

dotenv.config();
const app = express();
app.use(cors()); // allow frontend requests
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js!" });
});

app.post("/spotify/createPlaylist", requireAuth(createPlaylistRoute));

app.post("/spotify/exportPlaylist", requireAuth(exportToSpotify))

app.get("/api/openai", requireAuth(getAIRequest));

app.get("/spotify/login", spotifyLogin);

app.get("/callback", spotifyCallback);

app.get("/history", requireAuth(historyRoute));
app.get("/playlist/get", requireAuth(getPlaylistRoute));
app.delete("/playlist/delete", requireAuth(deletePlaylistRoute));
app.delete("/playlist/song/delete", requireAuth(deleteSongRoute))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
