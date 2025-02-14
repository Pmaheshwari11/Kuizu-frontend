import React from "react";

function Waiting({ players, handleGameOver, host }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="flex flex-col gap-5 justify-end min-w-96">
      <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl min-w-lg  mt-10 flex flex-col items-center gap-5">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Leaderboard
        </h2>

        <div className="w-full space-y-4">
          {players
            .sort((a, b) => b.points - a.points)
            .map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
              >
                <p className="text-lg font-semibold text-gray-700">
                  {index < 3 ? medals[index] : `#${index + 1}`} {player.name}
                </p>
                <p className="text-md text-gray-500 font-medium">
                  Score: {player.points}
                </p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-5 justify-center text-center text-white mt-6">
          <button
            onClick={() => handleGameOver()}
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
