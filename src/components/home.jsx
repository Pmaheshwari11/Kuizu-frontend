import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./logo";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFEFD5] p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="mb-4 transform -rotate-2">
          <Logo />
        </div>

        <div className="flex flex-col gap-6 w-full max-w-xs">
          <button
            onClick={() => navigate("/singlePlayer")}
            className="group relative bg-[#FFD700] border-4 border-black px-8 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🎯</span>
              <span className="text-black text-2xl font-black tracking-tight">
                SOLO PLAY
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate("/multiplayer")}
            className="group relative bg-[#FF6B6B] border-4 border-black px-8 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🎮</span>
              <span className="text-white text-2xl font-black tracking-tight">
                VS OTHERS
              </span>
            </div>
          </button>
        </div>

        <p className="mt-4 text-black font-bold text-lg bg-white border-2 border-black px-4 py-1 rounded-full rotate-1">
          Pick your mode! ⚡️
        </p>
      </div>
    </div>
  );
}

export default Home;
