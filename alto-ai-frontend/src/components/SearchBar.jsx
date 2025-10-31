import { useState } from "react";
import api from "../utils/api.js";
import CheckmarkGroup from "./CheckmarkGroup.jsx";
export default function SearchBar({setSongs}) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null); // "specific" or "artist" or "ai"
  
  function handleChange(e) {
    setInput(e.target.value);
  }

  async function sendInput() {
    const req = await api.post("/spotify/createPlaylist", { prompt: input , mode: selected});
    console.log("Response data:", req.data);
    setSongs(req.data);
    console.log("SetSongs: ", req.data);
  }

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      sendInput();
    }
  };

  return (
    <div className="w-[700px]">
      <div className="bg-sky-600 backdrop-blur-sm flex flex-col gap-4 rounded-xl p-6">
        <p className="text-left">Describe your perfect playlist</p>
        <div className="flex gap-3">
        <input
          placeholder=" Type your prompt"
          className="flex-grow border-2 border-red-500 rounded-lg px-3 py-2"
          onChange={handleChange}
          onKeyDown={handleEnter}
        />
        <button onClick={sendInput}>Generate playlist</button>
        </div>
        <CheckmarkGroup selected={selected} setSelected={setSelected}/>
      </div>
    </div>
  );
}
