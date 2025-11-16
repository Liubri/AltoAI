import { Playlist } from "../models/playlist.js";
import { searchTrack, } from "../search/songSearch.js";
import { parseSongsFromPrompt } from "../spotify/spotify.js";
import pLimit from "p-limit";

export async function deleteSongRoute(req, res, user) {
  try {
    const { id: track_id, playlistId } = req.body;
    const playlist = await Playlist.findOne({ user: user._id, _id: playlistId });
    if (!playlist) {
      return res.status(404).send("❌ Song not found in any playlist.");
    }
    playlist.playlist = playlist.playlist.filter(
      track => !track._id.equals(track_id)
    );
    await playlist.save();

    res.status(200).send("✅ Song deleted successfully.");
  } catch (err) {
    console.error("Error in /song/delete:", err);
    res.status(500).send("❌ Failed to delete song.");
  }
}

export async function addSongRoute(req, res, user) {
  try {
    const limit = pLimit(10);
    const { prompt, playlistId } = req.body;
    const tracks = parseSongsFromPrompt(prompt);
    const searchPromises = tracks.map((item) =>
      limit(() => searchTrack(user, item)));
    const results = await Promise.all(searchPromises);
    const trackIds = results.map(track => track._id);
    const playlist = await Playlist.findOne({ user: user._id, _id: playlistId }).populate("playlist");
    playlist.playlist.push(...trackIds);
    await playlist.save();
    await playlist.populate("playlist");
    res.status(200).send(playlist.playlist);
  } catch (err) {
    console.error("Error in /song/add:", err);
    res.status(500).send("❌ Failed to add song.");
  }
}