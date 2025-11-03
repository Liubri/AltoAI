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
      <div className="bg-secondary backdrop-blur-sm flex flex-col gap-4 rounded-xl p-6">
        <p className="text-accent text-left">Describe your perfect playlist</p>
        <div id="poda" className="flex gap-3 relative items-center">
          <div className="glow"></div>
          <div className="darkBorderBg"></div>
          <div className="darkBorderBg"></div>
          <div className="darkBorderBg"></div>
          <div class="white"></div>
          <div className="border"></div>
        <input
          placeholder=" Type your prompt"
          className="flex-grow rounded-lg px-3 py-2 bg-quaternary ml-1"
          onChange={handleChange}
          onKeyDown={handleEnter}
        />
        <button className="text-accent" onClick={() => sendInput(input, selected)}>Generate playlist</button>
        </div>
        <CheckmarkGroup className="text-accent" selected={selected} setSelected={setSelected}/>
      </div>
    </div>
  );
}
