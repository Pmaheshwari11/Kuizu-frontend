import React, { useState, useEffect } from "react";
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
      // Emit the join event
      socket.emit("joinParty", roomCode, username, avatar);
      socket.once("error", (status) => {
        if (status === "Party not found!") {
          toast.error("Room not found!"); // Show error if room is not found
        }
        return;
      });

      navigate(`/lobby/${btoa(roomCode)}`);
    } else {
      toast.error("Not connected to the server");
    }
  };

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

      <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl mt-10 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-black mb-6">Join a Room</h2>
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter Room Code"
          className="w-full p-3 text-lg bg-white rounded-lg mb-4"
        />
        <button
          onClick={joinRoom}
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-xl font-semibold transform hover:scale-105 transition-all"
        >
          Join Room
        </button>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
      />
    </div>
  );
}

export default JoinRoom;
