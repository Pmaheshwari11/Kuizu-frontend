import React, { useRef } from "react";

function MobileChatNPlayer({
  players,
  images,
  host,
  socket,
  handleKick,
  messages,
  sendMessage,
}) {
  const inputRef = useRef(null);

  const messageColors = {
    correct: "text-green-500",
    joined: "text-pink-500",
    left: "text-red-500",
    kick: "text-red-500",
    newHost: "text-orange-500",
  };

  const handleSendMessage = () => {
    if (inputRef.current) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = ""; // Clear input after sending
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:hidden">
      {/* Players Section */}
      <div className="bg-[#e3e3e337] p-3 rounded-lg shadow-2xl flex flex-col">
        <h2 className="text-lg font-bold text-center text-black mb-2">
          Players
        </h2>
        <div className="max-h-64 overflow-y-auto">
          <ul className="text-black space-y-2">
            {players.map((player) => (
              <li key={player.id || player.name} className="text-sm">
                <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl shadow-md transition-all duration-200 hover:scale-105">
                  <div className="flex items-center gap-2">
                    <img
                      src={images[player.img]}
                      alt="Avatar"
                      className="w-8 h-8 object-cover rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-black">
                        {player.name}
                        {host && player.id === socket.id && (
                          <span className="ml-1 text-blue-500 font-medium">
                            (Host)
                          </span>
                        )}
                      </span>
                      <span className="text-gray-700 text-xs">
                        Points: {player.points}
                      </span>
                    </div>
                  </div>

                  {host && player.id !== socket.id && (
                    <button
                      onClick={() => handleKick(player.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md shadow-md text-xs"
                    >
                      Kick
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-[#e3e3e337] p-3 rounded-lg shadow-2xl flex flex-col">
        <h2 className="text-lg font-bold text-center text-black mb-2">Chat</h2>
        <div className="max-h-64 overflow-y-auto bg-white p-2 rounded-lg mb-2 text-xs">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`text-black break-words ${
                messageColors[msg.code] || ""
              }`}
            >
              <strong>{msg.sender === "Kuizu" ? "" : `${msg.sender}:`}</strong>{" "}
              {msg.message}
            </p>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 p-2 bg-white rounded-lg text-xs"
            placeholder="Type..."
            onKeyDown={(event) => event.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileChatNPlayer;
