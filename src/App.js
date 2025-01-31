import "./App.css";
import Home from "./components/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SinglePlayer from "./components/singlePlayer";
import MultiPlayer from "./components/multiPlayer";
import CreateRoom from "./components/createRoom";
import ChooseAvatar from "./components/chooseAvtar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/singlePlayer" element={<SinglePlayer />} />
        <Route path="/multiplayer" element={<MultiPlayer />} />
        <Route path="/chooseAvtar" element={<ChooseAvatar />} />
        <Route path="/createRoom" element={<CreateRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
