import { useState } from "react";
import CheckmarkGroup from "./CheckmarkGroup.jsx";
export default function SearchBar({sendInput}) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null); // "specific" or "artist" or "ai"
  
  function handleChange(e) {
    setInput(e.target.value);
  }

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      sendInput(input, selected);
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
        <button onClick={() => sendInput(input, selected)}>Generate playlist</button>
        </div>
        <CheckmarkGroup selected={selected} setSelected={setSelected}/>
      </div>
    </div>
  );
}
