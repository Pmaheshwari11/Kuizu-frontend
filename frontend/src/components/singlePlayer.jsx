import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Logo from "./logo"; // Using the updated Logo component we made

function SinglePlayer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFEFD5] p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed left-6 top-6 z-50 bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <FiArrowLeft size={30} color="black" strokeWidth={3} />
      </button>

      <div className="mt-8 scale-75 md:scale-90">
        <Logo />
      </div>

      <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mt-4 relative z-10">
        <h2 className="text-4xl font-black text-center text-black mb-10 tracking-tight uppercase italic">
          Choose Your Fun!
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {/* Survival Mode */}
          <button
            onClick={() => navigate("/survival")}
            className="group relative bg-[#FFD700] border-4 border-black px-6 py-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] text-center"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🛡️</span>
              <span className="text-black text-xl font-black uppercase">
                Survival Mode
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </button>

          {/* Time Attack */}
          <button
            onClick={() => navigate("/timeAttack")}
            className="group relative bg-[#FF6B6B] border-4 border-black px-6 py-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] text-center"
          >
            <div className="flex items-center justify-between text-white">
              <span className="text-3xl">⏱️</span>
              <span className="text-black text-xl font-black uppercase">
                Time Attack
              </span>
              <span className="text-black opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </button>

          {/* Classic Mode */}
          <button
            onClick={() => navigate("/classic")}
            className="group relative bg-[#4ECDC4] border-4 border-black px-6 py-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[3px] active:translate-y-[3px] text-center"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🕹️</span>
              <span className="text-black text-xl font-black uppercase">
                Classic Mode
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="absolute top-20 right-10 w-12 h-12 border-4 border-black rounded-full bg-blue-400 rotate-12 hidden md:block"></div>
      <div className="absolute bottom-20 left-10 w-10 h-10 border-4 border-black bg-pink-400 -rotate-12 hidden md:block"></div>
    </div>
  );
}

export default SinglePlayer;
