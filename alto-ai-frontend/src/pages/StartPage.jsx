const SPOTIFY_AUTH_URL = import.meta.env.VITE_BACKEND_BASE_URL + "/spotify/login";
export default function StartPage() {
  function handleLogin() {
    window.location.href = SPOTIFY_AUTH_URL;
  }

  return (
    <div>
      <button onClick={handleLogin} className="text-red-800">Login</button>
    </div>
  )
}
