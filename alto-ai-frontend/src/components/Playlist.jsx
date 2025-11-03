import Song from "./Song";
import { songs1 } from "../testData";
import { formatDuration } from "../pages/MainPage";
export default function Playlist({ songs, setPlay, handlePlaySong, exportPlaylist }) {
  function createSongCard(song, index) {
    return (
      <Song
        key={index}
        name={song.title}
        artist={song.artist}
        img={song.imgURL}
        duration={formatDuration(song.duration)}
        onClick={() => {
          console.log("Clicked song:", song);
          setPlay(song);
          handlePlaySong(song);
        }}
      />
    );
  }

  

  return (
    <div className="p-3">
      <div className="flex justify-between mb-2">
        <h2 className="pl-4 mt-3 mb-6 text-left">Your playlist</h2>
        <button className="flex items-center" onClick={exportPlaylist}>
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
