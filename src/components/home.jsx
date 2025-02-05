import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from './logo';

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <Logo></Logo>

      <div className="flex flex-col gap-8 items-center justify-center">
        <button
          onClick={() => navigate("/singlePlayer")}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xl font-semibold px-10 py-5 rounded-full shadow-2xl hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all"
        >
          🎯 Single Player
        </button>
        <button
          onClick={() => navigate("/multiplayer")}
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-semibold px-10 py-5 rounded-full shadow-2xl hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all"
        >
          🎮 Multiplayer
        </button>
      </div>
    </div>
  );
}

export default Home;
