import { Play } from "lucide-react";
export default function Song(props) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-[2vh] bg-sky-700">
      <button className="!p-3 flex items-center bg-sky-900 hover:bg-sky-800"
      onClick={props.onClick}>
        <Play size={20} />
      </button>
      <div className="flex-1 text-left">
        <h3 className="font-medium truncate">{props.name}</h3>
        <p className="text-sm">{props.artist}</p>
      </div>
      <span>{props.duration}</span>
    </div>
  );
}
