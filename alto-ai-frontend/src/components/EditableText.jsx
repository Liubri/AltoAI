import { useState } from "react";

export default function EditableTitle({ setPlaylistName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("Your Playlist");
  return (
    <div className="pl-4 mt-3">
      {isEditing ? (
        <input
          value={title}
          onInput={(e) => setTitle(e.target.value)}
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
          {title}
        </h2>
      )}
    </div>
  );
}