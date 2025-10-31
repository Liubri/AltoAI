import { checkValidSongs } from "./spotify.js";
import { updateAccessToken } from "./spotifyAuth.js";
import { generatePlaylist } from "../openrouter.js";

export async function createPlaylistRoute(req, res, user) {
    try {
        await updateAccessToken(user);
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
        console.log("Sent Tracks: ", tracks);
        res.status(200).send(tracks);
    } catch (err) {
        // console.error("Error in /createPlaylist:", err);
        res.status(400).send("❌ Failed to create playlist.");
    }
}

// Helper to clean and split the prompt into an array of songs
function parseSongsFromPrompt(prompt) {
  if (!prompt) return [];
  return prompt
    .split(",")               // split by comma
    .map((s) => s.trim())    // remove extra spaces
    .filter((s) => s.length > 0); // remove empty strings
}