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
    correct: "text-green-600 font-black",
    joined: "text-purple-600 font-bold",
    left: "text-red-500 font-bold",
    kick: "text-red-600 font-bold",
    newHost: "text-orange-500 font-bold",
  };

  const handleSendMessage = () => {
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      sendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:hidden mt-6">
      {/* Players Section */}
      <div className="bg-white border-4 border-black p-3 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[350px]">
        <h2 className="text-sm font-black text-center text-black mb-3 uppercase tracking-tighter border-b-2 border-black border-dashed pb-1">
          Players
        </h2>
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {players.map((player) => (
            <div
              key={player.id || player.name}
              className="relative bg-white border-2 border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-black rounded-lg overflow-hidden bg-[#6C5CE7] shrink-0">
                    <img
                      src={images[player.img]}
                      alt="P"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase truncate max-w-[50px]">
                    {player.name}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] font-bold text-gray-500">
                    PTS: {player.points}
                  </span>
                  {host && player.id !== socket.id && (
                    <button
                      onClick={() => handleKick(player.id)}
                      className="bg-[#FF6B6B] border border-black text-white px-1 rounded text-[8px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                    >
                      Kick
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-white border-4 border-black p-3 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[350px]">
        <h2 className="text-sm font-black text-center text-black mb-3 uppercase tracking-tighter border-b-2 border-black border-dashed pb-1">
          Chat
        </h2>

        <div className="flex-1 overflow-y-auto bg-[#F8F9FA] border-2 border-black rounded-xl p-2 mb-3 shadow-inner">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`text-[10px] leading-tight mb-1 break-words ${messageColors[msg.code] || "text-black"}`}
            >
              <strong className="font-black uppercase">
                {msg.sender === "Kuizu" ? "SYSTEM" : `${msg.sender}:`}
              </strong>{" "}
              {msg.message}
            </p>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-2 bg-white border-2 border-black rounded-lg text-[10px] font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            placeholder="SAY SOMETHING..."
            onKeyDown={(event) => event.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="w-full bg-[#FFD700] border-2 border-black text-black py-1 rounded-lg text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[1px]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileChatNPlayer;
