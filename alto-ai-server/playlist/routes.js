import { populate } from "dotenv";
import { Playlist } from "../models/playlist.js";

export async function historyRoute(req, res, user) {
  try {
    const playlists = await Playlist.find({ user: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(
      playlists.map((pl) => ({
        id: pl._id,
        title: pl.title,
        prompt: pl.prompt,
        createdAt: pl.createdAt,
        track_count: pl.playlist.length,

      }))
    );
  } catch (err) {
    console.error("Error in /history:", err);
    res.status(500).send("❌ Failed to fetch history.");
  }
}

export async function getPlaylistRoute(req, res, user) {
  try {
    const id = req.query.id;
    const playlist = await Playlist.find({ user: user._id, _id: id }).findOne().populate('playlist');
    res
      .status(200)
      .send({
        playlist_id: playlist._id,
        tracks: playlist.playlist,
        prompt: playlist.prompt,
        title: playlist.title,
      });
  } catch (err) {
    console.error("Error in /playlist/get:", err);
    res.status(500).send("❌ Failed to fetch playlist.");
  }
}

export async function deletePlaylistRoute(req, res, user) {
  try {
    const id = req.query.id;
    await Playlist.deleteOne({ user: user._id, _id: id });
    res.status(200).send("✅ Playlist deleted successfully.");
  } catch (err) {
    console.error("Error in /playlist/delete:", err);
    res.status(500).send("❌ Failed to delete playlist.");
  }
}