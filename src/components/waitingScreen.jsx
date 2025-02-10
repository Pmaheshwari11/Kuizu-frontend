import React from "react";

function Waiting({ players, setIsGameActive, host }) {
  return (
    <div className="flex flex-col gap-5 justify-end">
      <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-full max-w-lg mt-10 flex flex-col items-center gap-5">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Leaderboard
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {players
            .sort((a, b) => b.score - a.score) // Sorting players by score (highest first)
            .map((player, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md text-center"
              >
                <p className="text-lg font-bold text-black">{player.name}</p>
                <p className="text-sm text-gray-600">Score: {player.points}</p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-5 justify-center text-center text-white mt-6">
          <button
            onClick={() => setIsGameActive(false)}
            disabled={!host}
            className={`${
              host
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-800 cursor-not-allowed"
            } text-white font-bold px-10 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all`}
          >
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Waiting;
