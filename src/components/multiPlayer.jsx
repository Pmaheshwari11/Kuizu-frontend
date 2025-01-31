import React from "react";
import { FiArrowLeft } from "react-icons/fi";

function MultiPlayer() {
  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <a href="/" className="fixed left-4 rounded-2xl bg-[#d2d1d142]">
        <FiArrowLeft size={30} />
      </a>
      <h1 className="mt-10 mb-8 flex justify-center items-center w-full font-henny-penny">
        <svg height="90" width="300">
          <text
            fontSize="80"
            fontWeight="bold"
            x="10"
            y="80"
            stroke="black"
            strokeWidth="0.1"
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

      <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-full max-w-lg mt-10">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Pick Your Playground!
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {/* Create a Room */}
          <a
            href="/chooseAvtar"
            className="bg-gradient-to-r from-teal-400 to-blue-500 text-white text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-teal-500 hover:to-blue-600 transform hover:scale-105 transition-all text-center"
          >
            🏗️ Create a Room
          </a>

          {/* Join a Room */}
          <a
            href="/join-room"
            className="bg-gradient-to-r from-indigo-400 to-purple-500 text-black text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-indigo-500 hover:to-purple-600 transform hover:scale-105 transition-all text-center"
          >
            🔑 Join a Room
          </a>
        </div>
      </div>
    </div>
  );
}

export default MultiPlayer;
