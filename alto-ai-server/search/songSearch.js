import { spotifySearch, addSongToDB } from "../spotify/spotify.js";

export async function searchTrack(user, song) {
  try {
    const spotifyRes = await spotifySearch(user, song, "track", 3);
    const track = spotifyRes.data.tracks.items[0];
    if (!track) return null;

    return await addSongToDB(track);
  } catch (err) {
    console.log(`No match for ${song}`, err);
    return null;
  }
}