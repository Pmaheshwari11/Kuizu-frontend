import React, { useRef } from "react";

function ChatBox({ messages, sendMessage }) {
  const inputRef = useRef(null);

  const messageColors = {
    correct: "text-green-600 font-black",
    joined: "text-[#6C5CE7] font-bold",
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
    <div className="hidden sm:flex flex-col w-1/4 bg-white border-4 border-black p-6 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[80vh]">
      <h2 className="text-3xl font-black text-center text-black mb-8 uppercase italic tracking-tighter border-b-4 border-black pb-4 border-dashed">
        Chat
      </h2>

      {/* Message Area */}
      <div
        id="chatBox"
        className="flex-1 h-64 overflow-y-auto bg-[#F8F9FA] border-4 border-black p-4 rounded-2xl mb-6 shadow-inner"
      >
        {messages.map((msg, index) => {
          const isSystem = msg.sender === "Kuizu";

          return (
            <div
              key={index}
              className={`mb-3 flex flex-col ${isSystem ? "items-center" : "items-start"}`}
            >
              {/* Message Bubble */}
              <div
                className={`px-3 py-2 rounded-xl border-2 border-black w-full break-words shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  isSystem
                    ? "bg-black text-white text-[10px] py-1 border-none shadow-none italic"
                    : "bg-white text-black"
                } ${messageColors[msg.code] || ""}`}
              >
                {!isSystem && (
                  <span className="block text-[10px] font-black uppercase tracking-wider opacity-50 mb-0.5">
                    {msg.sender}
                  </span>
                )}

                <p
                  className={`${isSystem ? "text-center" : "text-sm font-bold"}`}
                >
                  {isSystem && <span className="mr-2">📢</span>}
                  {msg.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="flex flex-col gap-3 mt-auto">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-4 bg-white border-4 border-black rounded-xl font-bold text-sm focus:outline-none focus:bg-[#FFEFD5] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400 placeholder:uppercase"
            placeholder="Type a message..."
            onKeyDown={(event) => event.key === "Enter" && handleSendMessage()}
          />
        </div>

        <button
          onClick={handleSendMessage}
          className="w-full bg-[#6C5CE7] border-4 border-black text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
