import { checkValidSongs, parseSongsFromPrompt, addTracksToDatabase, addAllTracksToPlaylist } from "./spotify.js";
import { generatePlaylist } from "../ai/openrouter.js";
import { Playlist } from "../models/playlist.js";
import { searchTrack, } from "../search/songSearch.js";

export async function createPlaylistRoute(req, res, user) {
    try {
        const { prompt, mode } = req.body;
        console.log("Prompt:", prompt, "Mode:", mode);

        let playlist;
        if (mode === "specific" || mode === "artist") {
            playlist = parseSongsFromPrompt(prompt)
        } else {
            // Default fallback
            playlist = await generatePlaylist(prompt);
        }

        console.log("🎵 Generated playlist for Spotify:", playlist);
        const tracks = await checkValidSongs(user, playlist, mode);

        let final_tracks = tracks;
        if (mode !== "specific") {
            final_tracks = tracks.sort(() => Math.random() - 0.5);
        }

        const retPlaylist = await addTracksToDatabase(final_tracks, user, prompt);
        res.status(200).send({playlist_id: retPlaylist._id, tracks:final_tracks, prompt: prompt, title: retPlaylist.title});
        
    } catch (err) {
        console.error("Error in /createPlaylist:", err);
        res.status(400).send("❌ Failed to create playlist.");
    }
}

export async function exportToSpotify(req, res, user) {
    const { playlist_id, playlist_name } = req.body;
    const playlist = await Playlist.findById(playlist_id).populate("playlist");
    if (playlist_name && playlist.title !== playlist_name) {
      playlist.title = playlist_name;
      await playlist.save();
      console.log(`✅ Playlist name updated to "${playlist_name}"`);
    }
    await addAllTracksToPlaylist(user, playlist.playlist.map((track)=>track.uri), playlist_name);
    res.sendStatus(200);
    console.log("Added all tracks!");
    res.status(200)
}

