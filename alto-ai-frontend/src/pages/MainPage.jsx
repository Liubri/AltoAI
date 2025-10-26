import { useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import { useState } from "react";

export default function MainPage() {
  const token = useSelector((state) => state.auth).token;
  const [songs, setSongs] = useState([]);

  if (!token) {
    console.log("FunctionCalled");
    console.log("✅ Login successful! Check console for tokens and user info.");
  }
  return (
    <div>
      <h1>AltoAI</h1>
      <SearchBar setSongs={setSongs}/>
    </div>
  );
}
