import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function MusicPlayer({name, artist, imgURL}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-violet-300 rounded-[1vh] p-5 shadow-md w-[260px]">
      <h3 className="text-left w-full text-sm font-semibold text-violet-900">
        Now Playing
      </h3>

      <img
        src={imgURL}
        alt="Album Cover"
        className="w-50 h-50 rounded-md object-cover shadow"
      />

      <div className="text-center">
        <h4 className="font-semibold truncate">{name}</h4>
        <p className="text-sm text-gray-700">{artist}</p>
      </div>

      {/* --- Audio element --- */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // replace with your song
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* --- Progress Bar --- */}
      <div className="w-full flex flex-col gap-1">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => {
            audioRef.current.currentTime = e.target.value;
            setCurrentTime(e.target.value);
          }}
          className="w-full h-1 rounded-lg appearance-none bg-violet-200 accent-violet-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-700">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* --- Controls --- */}
      <div className="flex items-center gap-2">
        {/* Change the onClick the play next song */}
        <button
          className="!p-2 rounded-full bg-violet-400 hover:bg-violet-500 transition flex items-center justify-center"
          onClick={() => (audioRef.current.currentTime = 0)}
        >
          <SkipBack size={16} />
        </button>

        <button
          className="p-3 rounded-full bg-violet-500 hover:bg-violet-600 transition flex items-center justify-center"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        <button
          className="!p-2 rounded-full bg-violet-400 hover:bg-violet-500 transition flex items-center justify-center"
          onClick={() => (audioRef.current.currentTime = duration)}
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}