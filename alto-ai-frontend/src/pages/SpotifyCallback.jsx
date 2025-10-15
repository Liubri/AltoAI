import { useDispatch } from "react-redux";
import { spotifyCallback } from "../utils/spotifyAuth";
import { setToken } from "../redux/spotifySlice";
import { useLocation, useNavigate } from "react-router-dom";

export default function SpotifyCallBack() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (!code) {
        console.error("No authorization code found in callback URL");
        navigate("/");
        return;
      }

      try {
        // Wait for the backend to exchange code → token
        const refresh_token = await spotifyCallback(code);
        console.log("RefreshToken:", refresh_token);

        // Save token in Redux
        dispatch(setToken(refresh_token));

        // Navigate to main page AFTER token is stored
        navigate("/");
      } catch (err) {
        console.error("Spotify callback failed:", err);
        navigate("/");
      }
    }

    handleCallback();
  }, [dispatch, navigate, location]);

  return <div>Connecting to Spotify...</div>;
}
