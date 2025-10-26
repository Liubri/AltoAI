import { useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import Song from "../components/Song";
import Playlist from "../components/Playlist";
import MusicPlayer from "../components/MusicPlayer";
import { single1, stats1 } from "../testData";
import PlaylistStats from "../components/PlaylistStats";
import Header from "../components/Header";

export default function MainPage() {
  const token = useSelector((state) => state.auth).token;
  const [songs, setSongs] = useState([]);
  const [play, setPlay] = useState({});

  if (!token) {
    console.log("FunctionCalled");
    console.log("✅ Login successful! Check console for tokens and user info.");
  }
  return (
    <div>
      <Header />
      <div className="flex justify-center mb-8">
        <SearchBar setSongs={setSongs} />
      </div>

      {songs.length > 0 ? (
        <div className="flex w-full gap-8">
          {/* Left Column: Playlist */}
          <div className="w-3/4 bg-violet-400 rounded-[1vh]">
            <Playlist songs={songs} setPlay={setPlay} />
          </div>

          {/* Right Column: Music Player + Stats */}
          <div className="w-1/4 flex flex-col gap-4">
            {/* Music Player on top */}
            {play.title && (
              <MusicPlayer
                name={play.title}
                artist={play.artist}
                imgURL={play.image}
              />
            )}

            {/* Playlist Stats below */}
            <PlaylistStats stats={stats1[0]} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
