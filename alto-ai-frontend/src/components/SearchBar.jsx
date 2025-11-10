import { useState } from "react";
import CheckmarkGroup from "./CheckmarkGroup.jsx";
import Loader from "./Loader.jsx";

export default function SearchBar({ sendInput, isLoading }) {
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
    <div className="w-[700px] shadow-md">
      <div className="bg-secondary backdrop-blur-sm flex flex-col gap-4 rounded-xl p-6">
        <p className="text-accent text-left">Describe your perfect playlist</p>
        <div id="poda" className="flex gap-3 relative items-center">
          <div className="glow"></div>
          <div className="darkBorderBg"></div>
          <div className="darkBorderBg"></div>
          <div className="darkBorderBg"></div>
          <div className="white"></div>
          <div className="border-searchbar"></div>
          <input
            placeholder=" Type your prompt"
            className="grow rounded-lg px-3 py-2 bg-quaternary ml-1"
            onChange={handleChange}
            onKeyDown={handleEnter}
          />
          <button
            className={`text-accent ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => sendInput(input, selected)}
            disabled={isLoading}
          >
            Generate playlist
          </button>
        </div>
        <div className="flex items-center justify-between h-[50px">
          <CheckmarkGroup
            className="text-accent"
            selected={selected}
            setSelected={setSelected}
          />
          <div
            className={`h-[30px] transition-opacity duration-100 ${
              isLoading ? "opacity-100" : "opacity-0"
            }`}
          >
            <Loader />
          </div>
          {/* {isLoading && <Loader />} */}
          {/* <Loader /> */}
        </div>
      </div>
    </div>
  );
}
