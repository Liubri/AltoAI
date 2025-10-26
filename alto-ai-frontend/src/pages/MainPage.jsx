import { useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import Song from "../components/Song";
import Playlist from "../components/Playlist";
import MusicPlayer from "../components/MusicPlayer";
import { single1, stats1 } from "../testData";
import PlaylistStats from "../components/PlaylistStats";
import Header from '../components/Header';

export default function MainPage() {
  const token = useSelector((state) => state.auth).token;
  const [songs, setSongs] = useState([]);

  if (!token) {
    console.log("FunctionCalled");
    console.log("✅ Login successful! Check console for tokens and user info.");
  }
  return (
    <div>
      <Header/>
      <div className="flex justify-center mb-8">
        <SearchBar setSongs={setSongs} />
      </div>
      <div className="flex w-full gap-8">
        {/* Left Column: Playlist */}
        <div className="w-3/4 bg-violet-400 rounded-[1vh]">
          <Playlist />
        </div>

        {/* Right Column: Music Player + Stats */}
        <div className="w-1/4 flex flex-col gap-4">
          {/* Music Player on top */}
          <MusicPlayer
            name={single1[0].name}
            artist={single1[0].artist}
            imgURL={single1[0].imgURL}
          />

          {/* Playlist Stats below */}
          <PlaylistStats stats={stats1[0]} />
        </div>
      </div>
    </div>
  );
}
