import { spotifySearch, addSongToDB } from "../spotify/spotify.js";
import spotifyApi from "../spotify/spotifyAxios.js";

export async function searchAI(user, song, usedPlaylists = []) {
  try {
    const spotifyRes = await spotifySearch(user, song, 'playlist', 10);

    const playlists = spotifyRes.data.playlists.items.filter(playlist => playlist !== null);
    const playlistIDs = playlists.map(playlist => playlist.id).filter(id => !usedPlaylists.includes(id));
    const returnedSongs = [];
    for (const id of playlistIDs) {
        usedPlaylists.push(id);
        const tracks = await getPlaylistTracks(user, id);
        returnedSongs.push(...tracks.filter(track => !returnedSongs.find(t => t.track.id === track.track.id)));
        if (returnedSongs.length >= 20) {
            break;
        }
    }

    const results = await Promise.all(
      returnedSongs.map(addSongToDB)
    )
    return results.filter(result => result !== null);;
  } catch (err) {
    console.log(`No match for ${song}`, err);
    return [];
  }
}


async function getPlaylistTracks(user, playlistId) {
  try {
    const res = await spotifyApi.get(`/v1/playlists/${playlistId}/tracks?limit=20`, {user:user});
    return res.data.items.map(item => item.track);
  } catch (err) {
    console.error(`Failed to get playlist items for ${playlistId}:`, err);
    return [];
  }
}