import React from "react";

function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <h1 className="text-[100px] font-extrabold drop-shadow-xl mt-10 mb-8 flex gap-2 text-center w-full justify-center font-henny-penny">
        <svg height="120" width="400">
          <text
            fontSize="100"
            fontWeight="bold"
            x="10"
            y="100"
            stroke="black"
            strokeWidth="0.000001"
            fill="none"
          >
            <tspan fill="red">K</tspan>
            <tspan fill="orange">u</tspan>
            <tspan fill="yellow">i</tspan>
            <tspan fill="green">z</tspan>
            <tspan fill="blue">u</tspan>
            <tspan fill="purple">?</tspan>
          </text>
        </svg>
      </h1>

      <div className="flex flex-col gap-8 items-center justify-center">
        <a
          href="/singlePlayer"
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xl font-semibold px-10 py-5 rounded-full shadow-2xl hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all"
        >
          🎯 Single Player
        </a>
        <a
          href="/multiplayer"
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-semibold px-10 py-5 rounded-full shadow-2xl hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all"
        >
          🎮 Multiplayer
        </a>
      </div>
    </div>
  );
}

export default Home;
