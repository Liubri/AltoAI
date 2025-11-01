import { useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import { useState, useRef, useEffect } from "react";
import Playlist from "../components/Playlist";
import MusicPlayer from "../components/MusicPlayer";
import { single1, stats1 } from "../testData";
import PlaylistStats from "../components/PlaylistStats";
import Header from "../components/Header";
import { Navigate } from "react-router-dom";
import api from "../utils/api.js";

export default function MainPage() {
  const token = useSelector((state) => state.auth).token;
  const [songs, setSongs] = useState([]);
  const [play, setPlay] = useState({});
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function exportPlaylist() {
    console.log("PlaylistID: ", currentPlaylistId);
    await api.post("/spotify/exportPlaylist", {
      playlist_id: currentPlaylistId,
    });
    console.log("Exported playlist to Spotify!");
  }

  async function sendInput(input, selected) {
    const req = await api.post("/spotify/createPlaylist", {
      prompt: input,
      mode: selected,
    });
    console.log("Response data:", req.data);
    setSongs(req.data?.tracks ?? []);
    console.log(req.data);
    setCurrentPlaylistId(req.data.playlist_id);
    console.log("SetSongs: ", req.data);
  }

  // Auto-play whenever the track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.preview;
      audioRef.current.volume = 0.2;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  if (!token) {
    console.log("FunctionCalled");
    console.log("✅ Login successful! Check console for tokens and user info.");
  }

  const stats = {
    totalTracks: songs.length,
    totalDuration: formatDuration(
      songs.reduce((acc, song) => acc + (song.duration), 0) ?? 0
    ),
  };
  return (
   <div>
      <Header />
      <div className="flex justify-center mb-8">
        <SearchBar
          sendInput={sendInput}
          setCurrentPlaylistId={setCurrentPlaylistId}
        />
      </div>

      {songs.length > 0 ? (
        <div className="flex w-full gap-8">
          {/* Left Column: Playlist */}
          <div className="w-3/4 bg-violet-400 rounded-[1vh]">
            <Playlist
              songs={songs}
              setPlay={setCurrentTrack}
              handlePlaySong={setCurrentTrack}
              exportPlaylist={exportPlaylist}
            />
          </div>

          {/* Right Column: Music Player + Stats */}
          <div className="w-1/4 flex flex-col gap-4">
            {/* Music Player on top */}
            {currentTrack && (
              <MusicPlayer
                name={currentTrack.title}
                artist={currentTrack.artist}
                imgURL={currentTrack.image}
                audioRef={audioRef}
                previewURL={currentTrack.preview}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            )}
            {/* Playlist Stats below */}
            <PlaylistStats stats={stats} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000); // convert ms → seconds
  const minutes = Math.floor(totalSeconds / 60); // get full minutes
  const seconds = totalSeconds % 60; // remaining seconds
  const paddedSeconds = seconds.toString().padStart(2, "0"); // add leading 0 if needed
  return `${minutes}:${paddedSeconds}`;
}
