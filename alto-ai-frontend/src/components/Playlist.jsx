import Song from "./Song";
import { songs1 } from "../testData";
import { formatDuration } from "../pages/MainPage";
import EditableText from "../components/EditableText";
import { Edit } from "lucide-react";
export default function Playlist({ songs, setPlay, handlePlaySong, exportPlaylist, playlistName, setPlaylistName }) {
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
    <div className="p-3 drop-shadow-lg">
      <div className="flex justify-between mb-2">
        <EditableText playlistName={playlistName} setPlaylistName={setPlaylistName} />
        <button className="flex items-center bg-quaternary outline-2 outline-transparent hover:outline-accent" onClick={(e) => { e.stopPropagation(); exportPlaylist(); }}>
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
