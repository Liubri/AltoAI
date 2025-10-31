import { useState } from "react";
import Checkmark from "./Checkmark";

export default function CheckmarkGroup({selected, setSelected}) {
  return (
    <div className="flex gap-4">
      <Checkmark
        name="Specific Song"
        checked={selected === "specific"}
        onChange={() =>
          setSelected(selected === "specific" ? null : "specific")
        }
        disabled={selected && selected !== "specific"}
      />
      <Checkmark
        name="Artist"
        checked={selected === "artist"}
        onChange={() =>
          setSelected(selected === "artist" ? null : "artist")
        }
        disabled={selected && selected !== "artist"}
      />
    </div>
  );
}