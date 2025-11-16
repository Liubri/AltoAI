import Checkmark from "./Checkmark";
import { Tooltip } from "react-tooltip";

export default function CheckmarkGroup({ selected, setSelected, className }) {
  return (
    <div className={`flex gap-4 ${className || ""}`}>
      <Checkmark
        name="Specific Song"
        checked={selected === "specific"}
        onChange={() =>
          setSelected(selected === "specific" ? null : "specific")
        }
        disabled={selected && selected !== "specific"}
        data-tooltip-id="specific-tooltip"
        data-tooltip-content="Example: 'Song 1, Song 2, Song 3'"
        data-tooltip-place="bottom"
      />
      <Checkmark
        name="Artist"
        checked={selected === "artist"}
        onChange={() => setSelected(selected === "artist" ? null : "artist")}
        disabled={selected && selected !== "artist"}
        data-tooltip-id="artist-tooltip"
        data-tooltip-content="Example: 'Artist 1, Artist 2'"
        data-tooltip-place="bottom"
      />
      <Tooltip
        id="specific-tooltip"
        style={{
          backgroundColor: "rgb(81, 41, 30)",
          color: "#edf4ed",
          borderRadius: "6px",
        }}
      />
      <Tooltip
        id="artist-tooltip"
        style={{
          backgroundColor: "rgb(81, 41, 30)",
          color: "#edf4ed",
          borderRadius: "6px",
        }}
      />
    </div>
  );
}
