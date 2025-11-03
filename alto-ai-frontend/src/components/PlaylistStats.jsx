export default function PlaylistStats({ stats }) {
  return (
    <div className="p-4 bg-secondary rounded-[1vh] p-5 shadow-md w-[260px]">
      <h3 className="text-left mb-4 w-full text-sm font-semibold text-accent">Playlist Stats</h3>
      
      <div className="flex justify-between mb-2">
        <span className="text-accent">Total Tracks:</span>
        <span className="font-semibold">{stats.totalTracks}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span className="text-accent">Total Duration:</span>
        <span className="font-semibold">{stats.totalDuration}</span>
      </div>
    </div>
  );
}