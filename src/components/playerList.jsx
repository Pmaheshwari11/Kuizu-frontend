import React from "react";

function PlayerList({ players, host, socket, images, handleKick }) {
  return (
    <div className="hidden sm:block w-1/4 bg-white border-4 border-black p-6 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[80vh] overflow-y-auto">
      <h2 className="text-3xl font-black text-center text-black mb-8 uppercase italic tracking-tighter border-b-4 border-black pb-4 border-dashed">
        Players
      </h2>
      <ul id="playerList" className="space-y-4">
        {players.map((player) => (
          <li key={player.id || player.name}>
            <div className="relative flex items-center justify-between bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              {/* Host Badge */}
              {player.id === socket.id && (
                <span className="absolute -top-3 -right-2 bg-[#FFD700] border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  YOU
                </span>
              )}

              <div className="flex items-center gap-4">
                {/* Avatar Frame */}
                <div className="w-14 h-14 bg-[#6C5CE7] border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  <img
                    src={images[player.img]}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-lg font-black text-black truncate leading-tight uppercase">
                    {player.name}
                    {host && player.id === socket.id && (
                      <span className="block text-[10px] text-[#6C5CE7]">
                        (PARTY LEADER)
                      </span>
                    )}
                  </span>
                  <span className="text-gray-500 font-bold text-xs uppercase tracking-wider mt-1">
                    PTS: <span className="text-black">{player.points}</span>
                  </span>
                </div>
              </div>

              {/* Kick Button for Host */}
              {host && player.id !== socket.id && (
                <button
                  onClick={() => handleKick(player.id)}
                  className="ml-2 bg-[#FF6B6B] border-2 border-black text-white p-1 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] hover:bg-red-600 transition-all font-black text-[10px] uppercase"
                >
                  Kick
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-center font-black text-xs text-gray-400 uppercase">
        {players.length} PLAYERS IN ROOM
      </div>
    </div>
  );
}

export default PlayerList;
