import { Trash } from "lucide-react";
export default function Sidebar({ isSidebarOpen }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-80 border-r backdrop-blur-sm transition-transform duration-300 ease-in-out z-10 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-screen overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-6 pt-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            History
          </h2>
        </div>

        {/* Static example playlists */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg cursor-pointer border border-gray-200 group"
            >
              <div>
                <p className="font-medium text-sm mb-2 line-clamp-2 text-white-800">
                  Example Playlist #{i}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>10 tracks</span>
                  <span>Oct 31, 2025</span>
                </div>
              </div>
              <button className="mt-2 h-10 min-w-max flex items-center bg-gray-200 rounded text-gray-700">
                <Trash size={25} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
