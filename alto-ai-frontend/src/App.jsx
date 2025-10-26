import "./App.css";
import StartPage from "./pages/StartPage";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/ai" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
