import "./App.css";
import Home from "./components/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SinglePlayer from "./components/singlePlayer";
import MultiPlayer from "./components/multiPlayer";
import CreateRoom from "./components/createRoom";
import ChooseAvatar from "./components/chooseAvtar";
import SP_SURVIVAL from "./components/Single Player/survival";
import SP_TIME from "./components/Single Player/timeAttack";
import SP_CLASSIC from "./components/Single Player/classic";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/singlePlayer" element={<SinglePlayer />} />
        <Route path="/multiplayer" element={<MultiPlayer />} />
        <Route path="/chooseAvtar" element={<ChooseAvatar />} />
        <Route path="/createRoom" element={<CreateRoom />} />
        <Route path="/survival" element={<SP_SURVIVAL />} />
        <Route path="/timeAttack" element={<SP_TIME />} />
        <Route path="/classic" element={<SP_CLASSIC />} />
      </Routes>
    </Router>
  );
}

export default App;
