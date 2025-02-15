import React, { useRef } from "react";

function ChatBox({ messages, sendMessage }) {
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
      inputRef.current.value = ""; // Clear input
    }
  };

  return (
    <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl hidden w-1/4 sm:block">
      <h2 className="text-3xl font-bold text-center text-black mb-6">Chat</h2>

      <div
        id="chatBox"
        className="h-64 overflow-y-auto bg-white p-4 rounded-lg mb-4"
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`text-black break-words ${
              messageColors[msg.code] || ""
            }`}
          >
            <strong>{msg.sender !== "Kuizu" ? `${msg.sender}: ` : ""}</strong>
            {msg.message}
          </p>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        className="w-full p-3 bg-white rounded-lg"
        placeholder="Type your message..."
        onKeyDown={(event) => event.key === "Enter" && handleSendMessage()}
      />

      <button
        onClick={handleSendMessage}
        className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}

export default ChatBox;
