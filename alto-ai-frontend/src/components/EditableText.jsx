import { useState } from "react";

export default function EditableTitle({ playlistName, setPlaylistName }) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="pl-4 mt-3">
      {isEditing ? (
        <input
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          onBlur={() => setIsEditing(false)} // stop editing when user clicks out
          autoFocus
          className="text-lg h-10 border p-2 rounded bg-secondary text-white"
        />
      ) : (
        <h2
          onClick={() => setIsEditing(true)}
          className="h-10 cursor-pointer text-lg hover:text-primary"
        >
          { playlistName === "Alto-AI" ? "Your Playlist" : playlistName }
        </h2>
      )}
    </div>
  );
}