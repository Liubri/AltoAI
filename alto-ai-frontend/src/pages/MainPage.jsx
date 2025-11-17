import { useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import { useState, useRef, useEffect } from "react";
import Playlist from "../components/Playlist";
import MusicPlayer from "../components/MusicPlayer";
import { single1, stats1, songs1 } from "../testData";
import PlaylistStats from "../components/PlaylistStats";
import Header from "../components/Header";
import { data, Navigate } from "react-router-dom";
import api from "../utils/api.js";
import Sidebar from "../components/Sidebar";
import { HistoryIcon } from "lucide-react";
import { Nvidia, DeepSeek, OpenAI, Qwen } from "@lobehub/icons";
import { useToast } from "../components/ToastContext";

export default function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = useSelector((state) => state.auth).token;
  const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState("Alto-AI");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistHistory, setPlaylistHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState("nvidia");
  const { showToast } = useToast();

  const options = [
    {
      name: "nvidia",
      label: "Nemotron Nano 9B",
      icon: <Nvidia.Color size={25} />,
    },
    {
      name: "deepseek",
      label: "DeepSeek V3.1",
      icon: <DeepSeek.Color size={25} />,
    },
    {
      name: "openai",
      label: "Gpt-oss-20b",
      icon: <OpenAI size={25} />,
    },
    {
      name: "qwen",
      label: "Qwen3 4B",
      icon: <Qwen size={25} />,
    },
  ];

  async function handleDeleteSong(id) {
    try {
      await api.delete(`/playlist/song/delete`, {
        data: {
          id,
          playlistId: currentPlaylistId,
        },
      });
      setSongs((prev) => prev.filter((song) => song._id !== id));
      setPlaylistHistory((prev) =>
        prev.map((playlist) =>
          playlist.id === currentPlaylistId
            ? { ...playlist, track_count: playlist.track_count - 1 }
            : playlist
        )
      );
    } catch (error) {
      console.error("Error deleting song:", error);
      showToast("Failed to delete song.", "error");
    }
  }

  async function fetchPlaylistById(playlistID) {
    try {
      const req = await api.get(`/playlist/get?id=${playlistID}`);
      setSongs(req.data.tracks);
      setCurrentPlaylistId(req.data.playlist_id);
      setPlaylistName(req.data.title);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  }

  async function deletePlaylistById(playlistID) {
    try {
      await api.delete(`/playlist/delete?id=${playlistID}`);
      setPlaylistHistory(playlistHistory.filter((pl) => pl.id !== playlistID));
      if (playlistID === currentPlaylistId) {
        setSongs([]);
        setCurrentPlaylistId(null);
        setPlaylistName("Alto-AI");
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      showToast("Failed to delete playlist.", "error");
    }
  }

  async function exportPlaylist(playlistID = null) {
    setIsLoading(true);
    const idToUse = playlistID ?? currentPlaylistId;
    await api.post("/spotify/exportPlaylist", {
      playlist_id: idToUse,
      playlist_name: playlistName,
    });
    showToast("Playlist exported to Spotify!", "success");
    setIsLoading(false);
  }

  async function sendInput(input, selected) {
    setIsLoading(true);
    const hasExistingPlaylist = currentPlaylistId !== null;
    // CASE 1: append songs → do NOT create a new playlist
    if (selected === "specific" && hasExistingPlaylist) {
      const req = await api.post("/playlist/song/add", {
        playlistId: currentPlaylistId,
        prompt: input,
      });

      setSongs(req.data);
      setIsLoading(false);
      return;
    }

    // CASE 2: NOT specific → create new playlist
    const req = await api.post("/spotify/createPlaylist", {
      prompt: input,
      mode: selected,
      ai: selectedAI,
    });
    setSongs(req.data.tracks);
    setPlaylistHistory((prev) => [
      {
        prompt: input,
        id: req.data.playlist_id,
        track_count: req.data.tracks.length,
        createdAt: new Date().toLocaleDateString(),
        title: req.data.title,
      },
      ...prev,
    ]);
    setPlaylistName("Alto-AI");
    setCurrentPlaylistId(req.data.playlist_id);
    setIsLoading(false);
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

  useEffect(() => {
    async function fetchHistory() {
      try {
        const req = await api.get("/history");
        setPlaylistHistory(req.data);
        console.log("Fetched playlist history:", req.data);
      } catch (error) {
        console.error("Error fetching playlist history:", error);
      }
    }
    fetchHistory();
  }, [isPlaying]);

  if (!token) {
    console.log("FunctionCalled");
    console.log("✅ Login successful! Check console for tokens and user info.");
    return <Navigate to="/" />;
  }

  const stats = {
    totalTracks: songs.length,
    totalDuration: formatDuration(
      songs.reduce((acc, song) => acc + song.duration, 0) ?? 0
    ),
  };
  return (
    <div className="flex relative">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        getPlaylistById={fetchPlaylistById}
        history={playlistHistory}
        deletePlaylistById={deletePlaylistById}
        exportPlaylist={exportPlaylist}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-80" : "ml-0"
        }`}
      >
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Sidebar Toggle Button */}
          <div className="flex items-center mb-4">
            <button
              className="!p-0 w-15 h-15 flex items-center outline-2 outline-transparent hover:outline-accent justify-center bg-quaternary border-gray-300 rounded-lg transition-all backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <HistoryIcon />
            </button>
          </div>
          <Header />
          <div className="flex justify-center mb-8">
            <SearchBar
              sendInput={sendInput}
              setCurrentPlaylistId={setCurrentPlaylistId}
              isLoading={isLoading}
              options={options}
              setSelectedAI={setSelectedAI}
            />
          </div>
          {songs.length > 0 && (
            <div className="flex w-full gap-8 animate-fade-in">
              {/* Left Column: Playlist */}
              <div className="w-3/4 bg-secondary rounded-[1vh] shadow-md">
                <Playlist
                  songs={songs}
                  setPlay={setCurrentTrack}
                  handlePlaySong={setCurrentTrack}
                  exportPlaylist={exportPlaylist}
                  playlistName={playlistName}
                  setPlaylistName={setPlaylistName}
                  onDeleteSong={handleDeleteSong}
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
          )}
        </div>
      </div>
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
