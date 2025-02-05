import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiClipboard, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ChooseAvatar from "./chooseAvtar";
import Logo from "./logo";
import { useWebSocket } from "../websocket";

function CreateRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState("");
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");

  const navigate = useNavigate();
  const { socket, connected } = useWebSocket();

  useEffect(() => {
    if (connected) {
      socket.on("partyCreated", (data) => {
        setRoomCode(data.currentPartyId);
      });
    }

    return () => {
      if (connected) {
        socket.off("partyCreated");
      }
    };
  }, [connected, socket]);

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
        className="fixed left-4 rounded-2xl bg-[#d2d1d142]"
      >
        <FiArrowLeft size={30} />
      </button>

      {username && avatar ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-3xl">
              <img
                src={images[avatar]}
                alt="Avatar"
                className="w-20 rounded-xl"
              />
              <span className="text-2xl font-sour-gummy">{username}</span>
            </div>
          </div>

          <Logo />

          <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-full max-w-lg mt-10 flex flex-col items-center gap-5">
            <h2 className="text-3xl font-bold text-center text-black mb-6">
              Choose Your Fun!
            </h2>

            <div className="grid grid-cols-3 gap-6">
              <span
                onClick={() => setMode("Survival")}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all text-center"
              >
                🛡️ Survival Mode
              </span>

              <span
                onClick={() => setMode("Time Attack")}
                className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all text-center"
              >
                ⏱️ Time Attack
              </span>
              <span
                onClick={() => setMode("Classic")}
                className="bg-gradient-to-r from-blue-400 to-teal-500 text-white text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-blue-500 hover:to-teal-600 transform hover:scale-105 transition-all text-center"
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
        </>
      ) : (
        <ChooseAvatar />
      )}

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

export default CreateRoom;
