import { Playlist } from "../models/playlist.js";

export async function deleteSongRoute(req, res, user) {
  try {
    const { id, playlistId } = req.body;
    const playlist = await Playlist.findOne({ user: user._id, _id: playlistId });
    if (!playlist) {
      return res.status(404).send("❌ Song not found in any playlist.");
    }
    playlist.playlist = playlist.playlist.filter(
      track => !track._id.equals(id)
    );
    await playlist.save();

    res.status(200).send("✅ Song deleted successfully.");
  } catch (err) {
    console.error("Error in /song/delete:", err);
    res.status(500).send("❌ Failed to delete song.");
  }
}