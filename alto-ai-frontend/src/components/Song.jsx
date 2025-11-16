import { Play, Trash } from "lucide-react";
export default function Song(props) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-[2vh] hover:bg-secondary filter brightness-90 transition-colors cursor-pointer">
      <button
        className="!p-3 flex items-center bg-quaternary outline-2 outline-transparent hover:outline-accent transition-all"
        onClick={props.onClick}
      >
        <Play size={20} />
      </button>
      <div className="flex-1 text-left">
        <h3 className="text-accent font-medium truncate">{props.name}</h3>
        <p className="text-sm">{props.artist}</p>
      </div>

      <div className="relative min-w-[60px] flex justify-end">
        <span className="group-hover:opacity-0 transition-opacity">
          {props.duration}
        </span>
        <button
          className="
            absolute right-0 top-1/2 -translate-y-1/2
            opacity-0 group-hover:opacity-100
            transition-opacity
            flex items-center bg-quaternary rounded text-tertiary 
            outline-2 outline-transparent hover:outline-accent
          "
          onClick={(e) => {
            e.stopPropagation();
            props.onDelete()
          }}
        >
          <Trash size={28} className="text-primary" />
        </button>
      </div>
    </div>
  );
}
