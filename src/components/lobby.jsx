import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiClipboard, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import ChooseAvatar from "./chooseAvtar";
import Logo from "./logo";
import { useWebSocket } from "../websocket";

function Lobby() {
  const { partyCode } = useParams();
  const roomCode = atob(partyCode);
  const [mode, setMode] = useState("");
  const [players, setPlayers] = useState([]); // State to store player list
  const [messages, setMessages] = useState([]); // State to store chat messages
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const { socket, connected } = useWebSocket();

  useEffect(() => {
    if (connected) {
      // Listen to player updates and update the player list
      socket.on("partyUpdated", (players) => {
        setPlayers(players); // Update player list state
      });

      // Listen to new messages and update the chat messages
      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: data.sender, message: data.message },
        ]);
      });
    }

    return () => {
      if (connected) {
        socket.off("partyUpdated");
        socket.off("receiveMessage");
      }
    };
  }, [connected, socket, roomCode, username]);

  const copyCodeToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast.success("Code copied to clipboard!");
    }
  };

  const startGame = () => {
    mode === ""
      ? toast.error("Select a game mode")
      : toast.info("Starting " + mode + " mode...");
  };

  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (!roomCode || !message) {
      alert("You must be in a party to send messages.");
      return;
    }

    socket.emit("sendMessage", roomCode, username, message);
    messageInput.value = ""; // Clear input after sending
  }

  const images = [
    "/Assets/avatar1.png",
    "/Assets/avatar2.png",
    "/Assets/avatar3.png",
    "/Assets/avatar4.png",
    "/Assets/avatar5.png",
    "/Assets/avatar6.png",
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <button
        onClick={() => navigate("/multiplayer")}
        className="fixed left-4 rounded-2xl bg-[#d2d1d142] z-10"
      >
        <FiArrowLeft size={30} />
      </button>
      <Logo />

      <div className="flex gap-10 w-full max-w-screen-xl mt-10">
        {/* Player List on Left */}
        <div className="w-1/4 bg-[#e3e3e337] p-6 rounded-lg shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Players
          </h2>
          <ul id="playerList" className="text-black">
            {players.map((player, index) => (
              <li key={index} className="text-lg mb-4">
                <div className="flex items-center justify-start gap-6 bg-white p-4 rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <img
                    src={images[player.img] || "/path/to/default-avatar.png"} // Fallback image
                    alt="Avatar"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <span className="text-xl font-semibold text-black">
                    {player.name}
                    {index === 0 && (
                      <span className="ml-2 text-blue-500 font-medium">
                        (Host)
                      </span>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Game Settings and Chat on Right */}
        <div className="flex flex-col gap-5 justify-end">
          <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-full max-w-lg mt-10 flex flex-col items-center gap-5">
            <h2 className="text-3xl font-bold text-center text-black mb-6">
              Choose Your Fun!
            </h2>

            <div className="grid grid-cols-3 gap-6">
              <span
                onClick={() => setMode("Survival")}
                className={`bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all text-center ${
                  mode === "Survival"
                    ? "border-[3px] border-black rounded-[10px]"
                    : ""
                }`}
              >
                🛡️ Survival Mode
              </span>

              <span
                onClick={() => setMode("Time Attack")}
                className={`bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all text-center ${
                  mode === "Time Attack"
                    ? "border-[3px] border-black rounded-[10px]"
                    : ""
                }`}
              >
                ⏱️ Time Attack
              </span>

              <span
                onClick={() => setMode("Classic")}
                className={`bg-gradient-to-r from-blue-400 to-teal-500 text-white text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-blue-500 hover:to-teal-600 transform hover:scale-105 transition-all text-center ${
                  mode === "Classic"
                    ? "border-[3px] border-black rounded-[10px]"
                    : ""
                }`}
              >
                🕹️ Classic Mode
              </span>
            </div>
            <div className="flex gap-5">
              <div className="flex items-center justify-center text-center text-white">
                {/* Copy Button Container */}
                <button
                  onClick={copyCodeToClipboard}
                  className="bg-blue-500 text-black py-3 px-8 rounded-xl shadow-lg flex items-center gap-4 transform hover:scale-105 transition-all"
                >
                  {/* Button Text */}
                  <span className="text-xl font-semibold">
                    Click to Copy Code
                  </span>
                  {/* Clipboard Icon */}
                  <FiClipboard size={30} />
                </button>
              </div>

              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-10 rounded-xl shadow-lg flex items-center gap-4 transform hover:scale-105 transition-all"
              >
                <span className="text-xl font-semibold text-black">
                  Start Game
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* Chat Box */}
        <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-1/4">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Chat
          </h2>
          <div
            id="chatBox"
            className="h-64 overflow-y-auto bg-white p-4 rounded-lg mb-4"
          >
            {messages.map((msg, index) => (
              <p key={index} className="text-black break-words">
                <strong>{msg.sender}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            id="messageInput"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
              }
            }}
            className="w-full p-3 bg-white rounded-lg"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeButton
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Lobby;
