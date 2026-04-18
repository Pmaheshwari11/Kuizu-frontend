import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Logo from "./logo";
import { useWebSocket } from "../websocket";

function ChooseAvatar() {
  const location = useLocation();
  const from = location.state?.from || "Unknown";
  const username = localStorage.getItem("username") || "";
  const avatar = parseInt(localStorage.getItem("avatar")) || 0;
  const [name, setName] = useState(username);
  const [selectedImage, setSelectedImage] = useState(avatar);

  const navigate = useNavigate();
  const { socket, connected } = useWebSocket();

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
        : (prevImage - 1 + images.length) % images.length,
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
        socket.once("partyCreated", (data) => {
          console.log(data);
          navigate(`/lobby/${btoa(data.partyId)}`);
        });
      } else {
        toast.error("Unable to connect to the server.");
      }
    } else {
      navigate(`/joinRoom`);
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
        onClick={() => navigate(-1)}
        className="fixed left-6 top-6 z-50 bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <FiArrowLeft size={30} color="black" strokeWidth={3} />
      </button>

      <Logo />

      <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mt-4 relative z-10 flex flex-col items-center gap-8">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">
          Who are you?
        </h2>

        {/* Avatar Selection Area */}
        <div className="relative flex items-center justify-center group">
          <div className="w-44 h-44 bg-[#6C5CE7] border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
            <img
              src={images[selectedImage]}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => handleImageChange("prev")}
            className="absolute -left-12 bg-[#FFD700] border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <FiChevronLeft size={24} strokeWidth={4} />
          </button>

          <button
            onClick={() => handleImageChange("next")}
            className="absolute -right-12 bg-[#FFD700] border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <FiChevronRight size={24} strokeWidth={4} />
          </button>
        </div>

        {/* Name Input Area */}
        <div className="w-full relative mt-4">
          <label className="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-xs font-black uppercase rounded border border-black">
            Nickname
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="TYPE HERE..."
            className="w-full p-4 pt-5 text-xl font-bold bg-[#F8F9FA] border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white placeholder:text-gray-400"
          />
          <span className="absolute bottom-4 right-4 text-2xl grayscale opacity-50">
            ✏️
          </span>
        </div>

        {/* Action Button */}
        <button
          className="w-full bg-[#4ECDC4] border-4 border-black py-5 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all group"
          onClick={startGame}
        >
          <span className="text-2xl font-black uppercase tracking-widest text-black">
            {from === "create" ? "READY TO PLAY" : "READY TO JOIN"}
          </span>
        </button>
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

export default ChooseAvatar;
