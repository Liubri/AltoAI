import Song from "./Song";
import { songs1 } from "../testData";
import { formatDuration } from "../pages/MainPage";
import EditableText from "../components/EditableText";
import { AnimatePresence, motion } from "framer-motion";
export default function Playlist({
  songs,
  setPlay,
  handlePlaySong,
  exportPlaylist,
  playlistName,
  setPlaylistName,
  onDeleteSong,
}) {
  function createSongCard(song) {
    return (
      <motion.div
        key={song._id}
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.6, height: 0, margin: 0, padding: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Song
          name={song.title}
          artist={song.artist}
          img={song.imgURL}
          duration={formatDuration(song.duration)}
          onClick={() => {
            setPlay(song);
            handlePlaySong(song);
          }}
          onDelete={() => onDeleteSong(song._id)}
        />
      </motion.div>
    );
  }

  return (
    <div className="p-3 drop-shadow-lg">
      <div className="flex justify-between mb-2">
        <EditableText
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
        />
        <button
          className="flex items-center bg-quaternary outline-2 outline-transparent hover:outline-accent"
          onClick={(e) => {
            e.stopPropagation();
            exportPlaylist();
          }}
        >
          <img
            src="/Spotify_icon.png" // path to your image
            alt="export"
            className="w-8 h-8 mr-2" // width, height, and spacing to the text
          />
          Export
        </button>
      </div>
      <AnimatePresence>{songs.map(createSongCard)}</AnimatePresence>
    </div>
  );
}
