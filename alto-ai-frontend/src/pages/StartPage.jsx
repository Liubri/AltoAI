const SPOTIFY_AUTH_URL =
  import.meta.env.VITE_BACKEND_BASE_URL + "/spotify/login";
import { Music2, Sparkles, ListMusic, Mic2 } from "lucide-react";
export default function StartPage() {
  function handleLogin() {
    window.location.href = SPOTIFY_AUTH_URL;
  }

  return (
    <div className="absolute inset-0 bg-linear-to-br from-primary via-secondary to-tertiary flex items-center justify-center">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Header */}
        <div className="text-center space-y-8 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-full bg-linear-to-br from-secondary to-primary shadow-lg shadow-primary/50">
              <Music2 className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-6xl text-accent">
            AI Playlist Generator
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Describe your mood, activity, or vibe, and let AI create the perfect
            Spotify playlist for you
          </p>

          {/* Login Button */}
          <div className="pt-8 flex justify-center">
            <button
              onClick={handleLogin}
              size="lg"
              className="flex justify-center bg-primary text-accent px-12 py-6 !rounded-full shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:bg-secondary"
            >
              <svg
                className="w-6 h-6 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Login with Spotify
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered",
              description: "Smart algorithms understand your music preferences",
            },
            {
              icon: Mic2,
              title: "Natural Language",
              description: "Just describe what you want in plain English",
            },
            {
              icon: ListMusic,
              title: "Instant Playlists",
              description: "Get personalized playlists created in seconds",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="p-3 rounded-full bg-white/10">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
