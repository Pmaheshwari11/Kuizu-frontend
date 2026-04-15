import React from "react";

function Logo() {
  return (
    <div className="flex justify-center items-center py-8 select-none">
      <h1
        className="text-7xl md:text-9xl font-black italic tracking-tighter"
        style={{
          color: "#fff",
          WebkitTextStroke: "3px black",
          textShadow: `
            4px 4px 0px #000,
            8px 8px 0px #FF6B6B
          `,
        }}
      >
        <span
          className="text-[#FF6B6B]"
          style={{ WebkitTextStroke: "3px black" }}
        >
          K
        </span>
        <span
          className="text-[#FFD700]"
          style={{ WebkitTextStroke: "3px black" }}
        >
          u
        </span>
        <span
          className="text-[#4ECDC4]"
          style={{ WebkitTextStroke: "3px black" }}
        >
          i
        </span>
        <span
          className="text-[#FF9F43]"
          style={{ WebkitTextStroke: "3px black" }}
        >
          z
        </span>
        <span
          className="text-[#6C5CE7]"
          style={{ WebkitTextStroke: "3px black" }}
        >
          u
        </span>
        <span
          className="text-[#FF6B6B]"
          style={{ WebkitTextStroke: "3px black" }}
        >
          ?
        </span>
      </h1>
    </div>
  );
}

export default Logo;
