import { useState } from "react";
import CheckmarkGroup from "./CheckmarkGroup.jsx";
import Loader from "./Loader.jsx";
import Dropdown from "./Dropdown.jsx";

export default function SearchBar({
  sendInput,
  isLoading,
  options,
  setSelectedAI,
}) {
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
    <div className="w-[837px] shadow-md rounded-xl z-10">
      <div className="bg-secondary backdrop-blur-sm flex flex-col gap-4 rounded-xl p-6">
        <p className="text-accent text-left">Describe your perfect playlist</p>
        <div className="flex gap-1 items-center">
          <div id="poda" className="grow flex relative items-center">
            <div className="glow"></div>
            <div className="darkBorderBg"></div>
            <div className="darkBorderBg"></div>
            <div className="darkBorderBg"></div>
            <div className="white"></div>
            <div className="border-searchbar"></div>
            <input
              placeholder=" Type your prompt"
              className="w-full rounded-lg px-3 py-2 bg-quaternary ml-2 mr-2"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
          </div>
          <button
            className={`text-accent bg-quaternary outline-2 outline-transparent hover:outline-accent ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => sendInput(input, selected)}
            disabled={isLoading}
          >
            Generate playlist
          </button>
          <Dropdown
            label="Options"
            options={options}
            setSelectedAI={setSelectedAI}
          />
        </div>
        <div className="flex items-center justify-between">
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
