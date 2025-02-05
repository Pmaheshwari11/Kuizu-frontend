import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft } from "react-icons/fi";
import Logo from "./logo";

function ChooseAvatar() {
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const navigate = useNavigate();

  const images = [
    "/Assets/avatar1.png",
    "/Assets/avatar2.png",
    "/Assets/avatar3.png",
    "/Assets/avatar4.png",
    "/Assets/avatar5.png",
    "/Assets/avatar6.png",
  ];

  const handleImageChange = (direction) => {
    setSelectedImage((prevImage) =>
      direction === "next"
        ? (prevImage + 1) % images.length
        : (prevImage - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    if (name !== "") {
      localStorage.setItem("username", name);
    }
    localStorage.setItem("avatar", selectedImage);
  }, [name, selectedImage]);

  const startGame = () => {
    if (name.trim() === "") {
      toast.error("Please enter a valid name!");
      return;
    }
    navigate("/createRoom");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <a
        href="/multiplayer"
        className="absolute top-4 left-4 rounded-2xl bg-[#d2d1d142]"
      >
        <FiArrowLeft size={30} />
      </a>
      
      <Logo></Logo>

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
