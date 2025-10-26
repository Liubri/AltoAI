import { checkValidSongs } from "./spotify.js";
import { updateAccessToken } from "./spotifyAuth.js";
import { generatePlaylist } from "../ai.js";

export async function createPlaylistRoute(req, res, user) {
    try {
        updateAccessToken(user);
        const prompt = req.body.prompt;
        console.log(prompt);
        const playlist = await generatePlaylist(prompt);
        console.log("🎵 Generated playlist for Spotify:", playlist);

        const tracks = await checkValidSongs(user, playlist);

        res.status(200).send(tracks);
    } catch (err) {
        // console.error("Error in /createPlaylist:", err);
        res.status(400).send("❌ Failed to create playlist.");
    }
}