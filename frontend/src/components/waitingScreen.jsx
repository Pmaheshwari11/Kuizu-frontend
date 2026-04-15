import React from "react";

function Waiting({ players, handleGameOver, host }) {
  const medals = ["🥇", "🥈", "🥉"];
  const colors = ["bg-[#FFD700]", "bg-[#C0C0C0]", "bg-[#CD7F32]"];

  return (
    <div className="flex flex-col gap-5 justify-end min-w-[350px] md:min-w-[450px]">
      <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mt-10 flex flex-col items-center gap-6 relative">
        <div className="absolute -top-5 bg-black text-white px-6 py-2 rounded-xl border-4 border-black font-black uppercase tracking-widest -rotate-2">
          Final Standings
        </div>

        <h2 className="text-4xl font-black text-center text-black mb-4 uppercase italic tracking-tighter mt-4">
          Leaderboard
        </h2>

        <div className="w-full space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {players
            .sort((a, b) => b.points - a.points)
            .map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-2xl border-4 border-black transition-all ${
                  index < 3
                    ? `${colors[index]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02]`
                    : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black italic">
                    {index < 3 ? medals[index] : `#${index + 1}`}
                  </span>
                  <p className="text-xl font-black uppercase tracking-tight text-black">
                    {player.name}
                  </p>
                </div>

                <div className="bg-black text-white px-4 py-1 rounded-lg border-2 border-black">
                  <p className="text-sm font-black uppercase">
                    Score: {player.points}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3 w-full mt-6">
          {!host && (
            <p className="text-[10px] font-black uppercase text-gray-400 italic mb-2">
              Waiting for host to restart...
            </p>
          )}
          <button
            onClick={() => handleGameOver()}
            disabled={!host}
            className={`w-full text-2xl font-black uppercase py-5 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
              host
                ? "bg-[#4ECDC4] text-black hover:translate-y-[-2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400 shadow-none"
            }`}
          >
            {host ? "Start New Game 🚀" : "Game Over"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Waiting;
