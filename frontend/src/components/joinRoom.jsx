import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../websocket";
import Logo from "./logo";

function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const { socket, connected } = useWebSocket();
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");

  const joinRoom = () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a valid room code");
      return;
    }
    if (connected) {
      socket.emit("joinParty", roomCode, username, avatar);
      socket.once("error", (status) => {
        if (status === "Party not found!") {
          toast.error("Room not found!");
        }
        return;
      });

      navigate(`/lobby/${btoa(roomCode)}`);
    } else {
      toast.error("Not connected to the server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFEFD5] p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/multiplayer")}
        className="fixed left-6 top-6 z-50 bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <FiArrowLeft size={30} color="black" strokeWidth={3} />
      </button>

      <Logo />

      <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mt-8 w-full max-w-md text-center relative z-10">
        <h2 className="text-4xl font-black text-black uppercase italic tracking-tighter mb-8">
          Enter Room
        </h2>

        {/* Room Code Input Area */}
        <div className="relative mb-8">
          <label className="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded border border-black z-10">
            Invite Code
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="TYPE CODE..."
            className="w-full p-5 text-2xl font-black bg-[#F8F9FA] border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white placeholder:text-gray-300 uppercase tracking-widest"
          />
        </div>

        <button
          onClick={joinRoom}
          className="w-full bg-[#6C5CE7] border-4 border-black text-white py-5 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
        >
          Join Room
        </button>

        <p className="mt-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
          Ask the host for the secret code!
        </p>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={800}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        limit={1}
      />
    </div>
  );
}

export default JoinRoom;
