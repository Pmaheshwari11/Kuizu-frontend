import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Logo from "./logo";

function MultiPlayer() {
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
          Multiplayer Arena
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {/* Create a Room */}
          <button
            onClick={() =>
              navigate("/chooseAvtar", { state: { from: "create" } })
            }
            className="group relative bg-[#4ECDC4] border-4 border-black px-6 py-5 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] text-center"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl group-hover:rotate-12 transition-transform">
                🏗️
              </span>
              <span className="text-black text-xl font-black uppercase tracking-tight">
                Create Room
              </span>
              <span className="text-black font-black">→</span>
            </div>
          </button>

          {/* Join a Room */}
          <button
            onClick={() =>
              navigate("/chooseAvtar", { state: { from: "join" } })
            }
            className="group relative bg-[#6C5CE7] border-4 border-black px-6 py-5 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] text-center"
          >
            <div className="flex items-center justify-between text-white">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                🔑
              </span>
              <span className="text-white text-xl font-black uppercase tracking-tight">
                Join Room
              </span>
              <span className="text-white font-black">→</span>
            </div>
          </button>
        </div>

        <div className="mt-10 pt-6 border-t-4 border-black border-dashed">
          <p className="text-center font-bold text-gray-500 uppercase text-sm tracking-widest">
            Compete with friends & climb the leaderboard!
          </p>
        </div>
      </div>

      <div className="absolute top-1/4 -right-10 w-24 h-24 bg-[#FF6B6B] border-4 border-black rounded-2xl rotate-45 opacity-20 hidden lg:block"></div>
      <div className="absolute bottom-1/4 -left-10 w-20 h-20 bg-[#FFD700] border-4 border-black rounded-full opacity-20 hidden lg:block"></div>
    </div>
  );
}

export default MultiPlayer;
