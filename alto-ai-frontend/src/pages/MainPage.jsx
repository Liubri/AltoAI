import { useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import { spotifyCallback, spotifyLogin } from "../utils/spotifyAuth";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const token = useSelector((state) => state.spotify).token;
  if (!token) {
    console.log("FunctionCalled");
    spotifyLogin();
    console.log("✅ Login successful! Check console for tokens and user info.");
  }
  return (
    <div>
      <h1>AltoAI</h1>
      <SearchBar />
    </div>
  );
}
