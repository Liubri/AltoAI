import spotifyAxios from "./spotifyAxios.js";
import pLimit from "p-limit";
import spotifyPreviewFinder from "spotify-preview-finder";
import dotenv from "dotenv"
async function searchTrack(song, token) {
  try {
    // Search Spotify first
    const spotifyRes = await spotifyAxios.get(
      `/v1/search?q=${encodeURIComponent(song)}&type=track&limit=3`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const track = spotifyRes.data.tracks.items[0];
    if (!track) return null;

    // Search iTunes using Spotify track info
    const itunesQuery = encodeURIComponent(`${track.name} ${track.artists[0].name}`);
    const itunesUrl = `https://itunes.apple.com/search?term=${itunesQuery}&entity=song&limit=1`;
    const itunesRes = await fetch(itunesUrl);
    const itunesData = await itunesRes.json();

    return {
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      album: track.album.name,
      uri: track.uri,
      id: track.id,
      image: track.album.images?.[0]?.url || null,
      duration: track.duration_ms,
      preview: itunesData.results[0]?.previewUrl || null,
    };
  } catch (err) {
    console.log(`No match for ${song}`, err);
    return null;
  }
}

export async function searchRandomTrack(song, token, spotifyLimit = 10, randomCount = 2) {
  try {
    // Search Spotify with the given limit
    const spotifyRes = await spotifyAxios.get(
      `/v1/search?q=${encodeURIComponent(song)}&type=track&limit=${spotifyLimit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const tracks = spotifyRes.data.tracks.items;
    if (!tracks || tracks.length === 0) return [];

    // Shuffle tracks and pick randomCount items
    const shuffled = tracks.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(randomCount, tracks.length));

    // Fetch previews
    const results = await Promise.all(
      selected.map(async (track) => {
        let preview = null;

        // Try Spotify preview first
        try {
          const spotifyPreview = await spotifyPreviewFinder(track.name, track.artists[0].name, 1);
          preview = spotifyPreview?.results?.[0]?.previewUrls?.[0] || null;
        } catch (err) {
          console.warn(`Spotify preview not found for ${track.name}:`, err.message);
        }

        // If no Spotify preview, fallback to iTunes
        if (!preview) {
          try {
            const itunesQuery = encodeURIComponent(`${track.name} ${track.artists[0].name}`);
            const itunesUrl = `https://itunes.apple.com/search?term=${itunesQuery}&entity=song&limit=1`;
            const itunesRes = await fetch(itunesUrl);
            const itunesData = await itunesRes.json();
            preview = itunesData.results[0]?.previewUrl || null;
          } catch (err) {
            console.warn(`iTunes preview not found for ${track.name}:`, err.message);
          }
        }

        return {
          title: track.name,
          artist: track.artists.map(a => a.name).join(", "),
          album: track.album.name,
          uri: track.uri,
          id: track.id,
          image: track.album.images?.[0]?.url || null,
          duration: track.duration_ms,
          preview,
        };
      })
    );

    return results;
  } catch (err) {
    console.log(`No match for ${song}`, err);
    return [];
  }
}

export async function getRandomTracksByArtist(token, artistName, limit = 20, perSearch = 10) {
  try {
    // Search Spotify for tracks by artist
    const query = encodeURIComponent(`artist:${artistName}`);
    const res = await spotifyAxios.get(`/v1/search?q=${query}&type=track&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tracks = res.data.tracks.items;
    if (!tracks || tracks.length === 0) return [];

    // Randomly select 'perSearch' tracks
    const shuffled = tracks.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(perSearch, tracks.length));

    return selected.map(track => ({
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      album: track.album.name,
      uri: track.uri,
      id: track.id,
      image: track.album.images?.[0]?.url || null,
      duration: track.duration_ms,
    }));
  } catch (err) {
    console.error(`Failed to get tracks for ${artistName}:`, err.message);
    return [];
  }
}

export async function getRandomTracksFromArtists(token, artistNames, maxTotalSongs = 10, perArtistLimit = 50) {
  const tracks = [];

  // Fetch tracks for each artist
  for (let artist of artistNames) {
    try {
      const query = encodeURIComponent(`artist:${artist}`);
      const res = await spotifyAxios.get(`/v1/search?q=${query}&type=track&limit=${perArtistLimit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const artistTracks = res.data.tracks.items;
      if (!artistTracks || artistTracks.length === 0) continue;

      // Randomly shuffle the artist's tracks
      const shuffled = artistTracks.sort(() => 0.5 - Math.random());

      // Decide how many tracks to take for this artist
      const remaining = maxTotalSongs - tracks.length;
      if (remaining <= 0) break;

      const take = Math.min(remaining, shuffled.length);
      const selected = shuffled.slice(0, take);

      // Fetch iTunes preview URLs concurrently
      const selectedWithPreviews = await Promise.all(
        selected.map(async (track) => {
          let preview = null;
          try {
            const itunesQuery = encodeURIComponent(`${track.name} ${track.artists[0].name}`);
            const itunesUrl = `https://itunes.apple.com/search?term=${itunesQuery}&entity=song&limit=1`;
            const itunesRes = await fetch(itunesUrl);
            const itunesData = await itunesRes.json();
            preview = itunesData.results[0]?.previewUrl || null;
          } catch (err) {
            console.error(`Failed to fetch iTunes preview for ${track.name}:`, err.message);
          }

          return {
            title: track.name,
            artist: track.artists.map(a => a.name).join(", "),
            album: track.album.name,
            uri: track.uri,
            id: track.id,
            image: track.album.images?.[0]?.url || null,
            duration: track.duration_ms,
            preview,
          };
        })
      );

      tracks.push(...selectedWithPreviews);
    } catch (err) {
      console.error(`Failed to fetch tracks for ${artist}:`, err.message);
    }
  }

  return tracks;
}

export async function searchTrackFromPrompt(prompt, token) {
  try {
    const res = await spotifyAxios.get(
      `/v1/search?q=${prompt}&type=track&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const tracks = res.data.tracks.items;
    //console.log("Received Track: ", track);
    return tracks.map((track)=>track.name)
  } catch (err) {
    console.log("Spotify Error", err);
    return [];
  }
}


async function addTrackToArray(user, playlist, mode) {
  console.log("AddtoTrackPlaylist: ", playlist);
  const limit = pLimit(5); // max 5 concurrent searches
  let searchPromises;
  if (mode === "specific" || mode === "artist") {
      searchPromises = playlist.map((item) =>
      limit(() => searchTrack(item, user.accessToken)));
  } else {
      searchPromises = playlist.map((item) =>
      limit(() => searchRandomTrack(item, user.accessToken)));
  }

  // wait for all results
  const results = await Promise.all(searchPromises);

  // filter out nulls (failed searches)
  const validTracks = results.flat().filter((track) => track !== null);
  return validTracks;
}

async function createPlaylist(userId, name, token) {
  const res = await spotifyAxios.post(
    `/v1/users/${userId}/playlists`,
    {
      name: name, // Playlist name
      public: false, // true = public, false = private
      description: "Generated by AltoAI",
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.id; // Returns the new playlist ID
}

async function addAllTracksToPlaylist(trackURIs, token) {
  try {
    // Step 1: get current user profile to find userId
    const userRes = await spotifyAxios.get("/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userId = userRes.data.id;

    // Step 2: create a new playlist
    const playlistId = await createPlaylist(userId, "Alto-AI", token);

    // Step 3: add all tracks from array
    const addRes = await spotifyAxios.post(
      `/v1/playlists/${playlistId}/tracks`,
      { uris: trackURIs },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Tracks added:", addRes.status === 201 ? "✅" : "❌");
  } catch (err) {
    console.error(
      "Error creating playlist or adding tracks:",
      err.response?.data || err.message
    );
  }
}

export async function checkValidSongs(user, playlist, mode) {
  let tracks;
  if (mode === "artist") {
    tracks = await getRandomTracksFromArtists(user.accessToken, playlist)
  } else {
    tracks = await addTrackToArray(user, playlist, mode);
  }
  if (tracks.length > 0) {
    const trackURIs = tracks.map((track) => track.uri);
    //await addAllTracksToPlaylist(trackURIs, user.accessToken);
  } else {
    console.log("⚠️ No valid tracks found.");
  }
  
  return tracks;
}
