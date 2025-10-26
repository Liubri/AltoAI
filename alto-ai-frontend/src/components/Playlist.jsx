import Song from "./Song";
import { songs1 } from "../testData";
export default function Playlist({ songs, setPlay }) {
  function createSongCard(songs) {
    return (
      <Song
        key={songs.id}
        name={songs.title}
        artist={songs.artist}
        img={songs.imgURL}
        duration={formatDuration(songs.duration)}
        onClick={() => {
          console.log("Clicked song:", songs);
          setPlay(songs);
        }}
      />
    );
  }

  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000); // convert ms → seconds
    const minutes = Math.floor(totalSeconds / 60); // get full minutes
    const seconds = totalSeconds % 60; // remaining seconds
    const paddedSeconds = seconds.toString().padStart(2, "0"); // add leading 0 if needed
    return `${minutes}:${paddedSeconds}`;
  }

  return (
    <div className="p-3">
      <div className="flex justify-between mb-2">
        <h2 className="pl-1 mt-3 mb-6 text-left">Your playlist</h2>
        <button className="flex items-center">
          <img
            src="/Spotify_icon.png" // path to your image
            alt="export"
            className="w-8 h-8 mr-2" // width, height, and spacing to the text
          />
          Export
        </button>
      </div>
      <div className="space-y-3">{songs.map(createSongCard)}</div>
    </div>
  );
}
