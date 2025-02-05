import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { WebSocketProvider } from "./websocket"; // Import the WebSocket provider

import Home from "./components/home";
import SinglePlayer from "./components/singlePlayer";
import MultiPlayer from "./components/multiPlayer";
import Lobby from "./components/lobby";
import ChooseAvatar from "./components/chooseAvtar";
import SP_SURVIVAL from "./components/Single Player/survival";
import SP_TIME from "./components/Single Player/timeAttack";
import SP_CLASSIC from "./components/Single Player/classic";
import JoinRoom from "./components/joinRoom";

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/singlePlayer" element={<SinglePlayer />} />
          <Route path="/multiplayer" element={<MultiPlayer />} />
          <Route path="/chooseAvtar" element={<ChooseAvatar />} />
          <Route path="/lobby/:partyCode" element={<Lobby />} />
          <Route path="/joinRoom" element={<JoinRoom />} />
          <Route path="/survival" element={<SP_SURVIVAL />} />
          <Route path="/timeAttack" element={<SP_TIME />} />
          <Route path="/classic" element={<SP_CLASSIC />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
