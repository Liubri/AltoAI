import Song from "./Song";
import { songs1 } from "../testData";
export default function Playlist() {

  function createSongCard(songs) {
    return (
      <Song
        key={songs.id}
        name={songs.name}
        artist={songs.artist}
        img={songs.imgURL}
        duration={songs.duration}
      />
    );
  }

  return (
    <div className="p-3">
      <h2 className="pl-1 mt-3 mb-6 text-left">Your playlist</h2>
      <div className="space-y-3">
        {songs1.map(createSongCard)}
      </div>
    </div>
  );
}
