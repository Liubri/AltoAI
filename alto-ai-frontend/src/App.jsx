import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import SpotifyCallBack from "./pages/SpotifyCallback";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/callback" element={<SpotifyCallBack/>} />
    </Routes>
  );
}

export default App;
