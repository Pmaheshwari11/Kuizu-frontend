import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft } from "react-icons/fi";
import Logo from "./logo";
import { useWebSocket } from "../websocket"; // Import the custom hook

function ChooseAvatar() {
  const location = useLocation();
  const from = location.state?.from || "Unknown";
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");
  const [name, setName] = useState(username);
  const [selectedImage, setSelectedImage] = useState(avatar || 0);

  const navigate = useNavigate();
  const { socket, connected } = useWebSocket(); // Use the WebSocket context

  const images = [
    "/Assets/avatar1.png",
    "/Assets/avatar2.png",
    "/Assets/avatar3.png",
    "/Assets/avatar4.png",
    "/Assets/avatar5.png",
    "/Assets/avatar6.png",
    "/Assets/avatar7.png",
    "/Assets/avatar8.png",
    "/Assets/avatar9.png",
    "/Assets/avatar10.png",
    "/Assets/avatar11.png",
    "/Assets/avatar12.png",
    "/Assets/avatar13.png",
    "/Assets/avatar14.png",
    "/Assets/avatar15.png",
    "/Assets/avatar16.png",
    "/Assets/avatar17.png",
  ];

  const handleImageChange = (direction) => {
    setSelectedImage((prevImage) =>
      direction === "next"
        ? (prevImage + 1) % images.length
        : (prevImage - 1 + images.length) % images.length
    );
  };

  const startGame = () => {
    if (name.trim() === "") {
      toast.error("Please enter a valid name!");
      return;
    }

    if (name.toLowerCase() === "kuizu") {
      toast.error("Your name cannot be Kuizu");
      return;
    }

    localStorage.setItem("username", name);
    localStorage.setItem("avatar", selectedImage);
    if (from === "create") {
      if (connected) {
        socket.emit("createParty", name, selectedImage);
        socket.on("partyCreated", (data) => {
          navigate(`/lobby/${btoa(data.currentPartyId)}`);
        });
      } else {
        toast.error("Unable to connect to the server. Please try again.");
      }
    } else {
      navigate(`/joinRoom`);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="absolute top-4 left-4 rounded-2xl bg-[#d2d1d142] z-10"
      >
        <FiArrowLeft size={30} />
      </button>

      <Logo />

      <div className=" p-6 rounded-lg  w-full max-w-lg flex flex-col items-center gap-6">
        <div className="relative w-40 flex items-center justify-center">
          <img
            src={images[selectedImage]}
            alt="Avatar"
            className="w-full rounded-xl shadow-lg"
          />

          <button
            onClick={() => handleImageChange("prev")}
            className="absolute left-[-35px] bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-110"
          >
            &#10094;
          </button>

          <button
            onClick={() => handleImageChange("next")}
            className="absolute right-[-35px] bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-110"
          >
            &#10095;
          </button>
        </div>

        <div className="w-full max-w-md relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-4 text-xl rounded-xl border-2 border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200"
          />
          <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 text-2xl">
            ✏️
          </span>
        </div>

        <button
          className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-10 rounded-xl shadow-lg flex items-center gap-4 transform hover:scale-110 hover:translate-y-1 transition-all"
          onClick={startGame}
        >
          <span className="text-xl font-semibold text-black">Start Game</span>
        </button>
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

export default ChooseAvatar;
