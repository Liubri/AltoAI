import { Trash } from "lucide-react";
export default function Sidebar({ isSidebarOpen, getPlaylistById, deletePlaylistById, history, exportPlaylist }) {
  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-80 border-r backdrop-blur-sm transition-transform duration-300 ease-in-out z-10 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-screen overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-6 pt-4">
          <h2 className="text-tertiary text-lg font-semibold flex items-center gap-2">
            History
          </h2>
        </div>

        {/* Static example playlists */}
        <div className="space-y-3">
          {history.map((playlist, i) => (
            <div
              key={i}
              className="p-4 rounded-lg cursor-pointer border border-secondary group hover:transform hover:scale-[1.05] transition-transform duration-200 hover:brightness-105 bg-secondary hover:shadow-lg"
              onClick={() => {
                console.log("Clicked playlist_id:", playlist.id);
                getPlaylistById(playlist.id);
              }}
            >
              <div>
                <p className="font-medium text-xl mb-2 line-clamp-2 text-accent">
                  {playlist.title}
                </p>
                <p className="text-xs mb-2 text-accent overflow-hidden wrap-break-word">
                  {playlist.prompt}
                </p>
                <div className="flex items-center justify-between text-xs text-accent">
                  <span>{playlist.track_count} tracks</span>
                  <span>{formatDate(playlist.createdAt)}</span>
                </div>
              </div>
              <div className="flex justify-between opacity-0 transition-opacity ease-in-out group-hover:opacity-100 mt-2">
                <button 
                  className="center h-11 min-w-max bg-quaternary outline-2 outline-transparent hover:outline-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    exportPlaylist(playlist.id)
                  }}
                >
                  <img
                    src="/Spotify_icon.png" // path to your image
                    alt="export"
                    className="w-6 h-6" // width, height, and spacing to the text
                  />
                </button>
                <button 
                  className="h-11 min-w-max flex items-center bg-quaternary rounded text-tertiary outline-2 outline-transparent hover:outline-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylistById(playlist.id);
                  }}
                >
                  <Trash 
                    size={28} 
                    className="text-primary" 
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
