import React from "react";

function PlayerList({ players, host, socket, images, handleKick }) {
  return (
    <div className="hidden sm:block w-1/4 bg-[#e3e3e337] p-6 rounded-lg shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-black mb-6">
        Players
      </h2>
      <ul id="playerList" className="text-black">
        {players.map((player) => (
          <li key={player.id || player.name} className="text-lg mb-4">
            <div className="flex items-center justify-between gap-6 bg-white p-4 rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-6">
                <img
                  src={images[player.img]}
                  alt="Avatar"
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-black">
                    {player.name}
                    {host && player.id === socket.id && (
                      <span className="ml-2 text-blue-500 font-medium">
                        (Host)
                      </span>
                    )}
                  </span>
                  <span className="text-gray-700 text-lg">
                    Points: {player.points}
                  </span>
                </div>
                {host && player.id !== socket.id && (
                  <button
                    onClick={() => handleKick(player.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg shadow-md transition duration-200"
                  >
                    Kick
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default PlayerList;
