import spotifyAxios from "./spotifyAxios.js";
import pLimit from "p-limit";
import dotenv from "dotenv"
import spotifyPreviewFinder from "spotify-preview-finder";
import {Song} from "../models/song.js";
import { Playlist } from "../models/playlist.js";

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
    return await getMusicPreview(track);
  } catch (err) {
    console.log(`No match for ${song}`, err);
    return null;
  }
}

export async function searchRandomTrack(song, token, spotifyLimit = 20) {
  try {
    // Search Spotify with the given limit
    const spotifyRes = await spotifyAxios.get(
      `/v1/search?q=${encodeURIComponent(song)}&type=track&limit=${spotifyLimit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const tracks = spotifyRes.data.tracks.items;
    if (!tracks || tracks.length === 0) return [];

    // Fetch previews
    const results = await Promise.all(
      tracks.map(getMusicPreview)
    );
    return results;
  } catch (err) {
    console.log(`No match for ${song}`, err);
    return [];
  }
}

export async function getRandomTracksByArtist(artistName, token) {
  try {
    // Search Spotify for tracks by artist
    const limit = 20;
    const query = encodeURIComponent(`artist:${artistName}`);
    const res = await spotifyAxios.get(`/v1/search?q=${query}&type=track&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tracks = res.data.tracks.items;

    // If no tracks found, fallback to random track search
    if (!tracks || tracks.length === 0) {
      return searchRandomTrack(artistName, token, limit);
    }

    // console.log(tracks);
    const results = await Promise.all(
      tracks.map(getMusicPreview)
    );

    return results;
  } catch (err) {
    console.error(`Failed to get tracks for ${artistName}:`, err.message);
    return [];
  }
}

// const selectedWithPreviews = await Promise.all(selected.map(getMusicPreview));
export async function getMusicPreview(track) {
  //If Song is in the database return it
  const songData = await Song.findOne({ id: track.id });
  if (songData) {
    return songData;
  }
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

  const newSongData = {
    title: track.name,
    artist: track.artists.map(a => a.name).join(", "),
    album: track.album.name,
    uri: track.uri,
    id: track.id,
    image: track.album.images?.[0]?.url || null,
    duration: track.duration_ms,
    preview,
  };

  //Put Song in database
  const song = await Song.create(newSongData).catch(err => {
    console.error(`Failed to save song ${track.name}:`, err.message);
  });

  return song;
      
}

function takeRandom(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

async function addTrackToArray(user, playlist, mode) {
  const limit = pLimit(10); // max 5 concurrent searches
  let searchPromises;
  if (mode === "artist"){
    searchPromises = playlist.map((item) =>
      limit(() => getRandomTracksByArtist(item, user.accessToken)));
  }
  else if (mode === "specific") {
      searchPromises = playlist.map((item) =>
      limit(() => searchTrack(item, user.accessToken)));
  } else {
      searchPromises = playlist.map((item) =>
      limit(() => searchRandomTrack(item, user.accessToken)));
  }

  // wait for all results
  const results = await Promise.all(searchPromises);

  if (mode === null || mode === "artist") {
    const validTracks = []
    for (let i = 0; i < results.length; i++) {
      let needToAdd = Math.ceil(10 / results.length);
      while(needToAdd > 0){
        const track = takeRandom(results[i]);
        // console.log("Selected Track: ", track.title ?? "artist", validTracks.map(t => t.title + " - " + t.artist));
        if(track !== null && validTracks.filter(t => t.title === track.title && t.artist === track.artist).length === 0){
          validTracks.push(track);
          needToAdd -= 1;
        }
      }
    }
    return validTracks;
  }
  else{
    const validTracks = results.flat().filter((track) => track !== null);
    return validTracks;
  }
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

export async function addAllTracksToPlaylist(trackURIs, token) {
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
  console.log("Check Songs: ", playlist);
  const tracks = await addTrackToArray(user, playlist, mode);
  
  if (tracks.length > 0) {
    const trackURIs = tracks.map((track) => track.uri);
    //await addAllTracksToPlaylist(trackURIs, user.accessToken);
  } else {
    console.log("⚠️ No valid tracks found.");
  }
  
  return tracks;
}

// Helper to clean and split the prompt into an array of songs
export function parseSongsFromPrompt(prompt) {
  if (!prompt) return [];
  return prompt
    .split(",")               // split by comma
    .map((s) => s.trim())    // remove extra spaces
    .filter((s) => s.length > 0); // remove empty strings
}

export async function addTracksToDatabase(tracks, user) {
  const playlist = await Playlist.create({
    user: user._id,
    playlist: tracks.map(track => track._id)
  });


  return playlist;
}
  