import { searchAI } from "./aiSearch.js";
import { spotifySearch,addSongToDB } from "../spotify/spotify.js";

export async function searchArtist(user, artistName) {
  try {
    // Search Spotify for tracks by artist
    const limit = 20;
    const query = `artist:${artistName}`;
    const res = await spotifySearch(user, query, "track", limit);

    const tracks = res.data.tracks.items;

    // If no tracks found, fallback to random track search
    if (!tracks || tracks.length === 0) {
      return searchAI(user, artistName);
    }

    // console.log(tracks);
    const results = await Promise.all(
      tracks.map(addSongToDB)
    )

    return results.filter(result => result !== null);;
  } catch (err) {
    console.error(`Failed to get tracks for ${artistName}:`, err.message);
    return [];
  }
}