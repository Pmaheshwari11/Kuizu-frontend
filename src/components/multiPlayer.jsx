import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Logo from "./logo";

function MultiPlayer() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <button
        onClick={() => navigate("/")}
        className="fixed left-4 rounded-2xl bg-[#d2d1d142]"
      >
        <FiArrowLeft size={30} />
      </button>

      <Logo />

      <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-full max-w-lg mt-10">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Pick Your Playground!
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {/* Create a Room */}
          <button
            onClick={() =>
              navigate("/chooseAvtar", { state: { from: "create" } })
            }
            className="bg-gradient-to-r from-teal-400 to-blue-500 text-white text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-teal-500 hover:to-blue-600 transform hover:scale-105 transition-all text-center"
          >
            🏗️ Create a Room
          </button>

          {/* Join a Room */}
          <button
            onClick={() =>
              navigate("/chooseAvtar", { state: { from: "join" } })
            }
            className="bg-gradient-to-r from-indigo-400 to-purple-500 text-black text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-indigo-500 hover:to-purple-600 transform hover:scale-105 transition-all text-center"
          >
            🔑 Join a Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default MultiPlayer;
