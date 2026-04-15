import React from "react";
import { FiClipboard } from "react-icons/fi";

function GameSetting({
  category,
  noOfQuestion,
  time,
  difficulty,
  copied,
  copyCodeToClipboard,
  host,
  handleCategoryChange,
  handleDifficultyChange,
  handleNoOfQuestionsChange,
  handleTimerChange,
  loading,
  getQuiz,
}) {
  const commonSelectClass =
    "w-full bg-white border-4 border-black text-black font-black px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/30 appearance-none cursor-pointer";

  return (
    <div className="flex flex-col gap-5 justify-end w-full max-w-lg">
      <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col items-center gap-6 relative overflow-hidden">
        <h2 className="text-4xl font-black text-center text-black uppercase italic tracking-tighter mb-4">
          Match Setup
        </h2>
        <div className="flex flex-col gap-8 w-full">
          {/* Dropdowns */}
          {[
            {
              label: "Category",
              id: "category",
              value: category,
              onChange: handleCategoryChange,
              options: [
                "All",
                "Sports",
                "Cinema",
                "Maths",
                "Geography",
                "Aptitude",
                "Anime",
                "Indian History",
                "Indian Festivals & Culture",
                "Basic Science",
                "Riddles & Puzzles",
                "Indian Food & Cuisine",
                "Indian Mythology",
              ],
            },
            {
              label: "Questions",
              id: "questions",
              value: noOfQuestion,
              onChange: handleNoOfQuestionsChange,
              options: ["10", "15", "20", "25", "30"],
            },
            {
              label: "Seconds per round",
              id: "timer",
              value: time,
              onChange: handleTimerChange,
              options: ["5", "10", "15", "20"],
            },
          ].map(({ label, id, value, onChange, options }) => (
            <div key={id} className="flex flex-col relative">
              <label
                htmlFor={id}
                className="text-xs font-black text-black uppercase tracking-widest mb-2 ml-1"
              >
                {label}
              </label>
              <div className="relative">
                <select
                  id={id}
                  value={value}
                  disabled={!host}
                  onChange={onChange}
                  className={`${commonSelectClass} ${
                    !host
                      ? "bg-gray-100 cursor-not-allowed opacity-70"
                      : "hover:translate-y-[-2px] active:translate-y-[1px] active:shadow-none"
                  }`}
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt} className="font-bold">
                      {opt}
                    </option>
                  ))}
                </select>
                {/* Custom arrow for the select */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black">
                  ▼
                </div>
              </div>
            </div>
          ))}

          {/* Difficulty Slider */}
          <div className="flex flex-col bg-[#F8F9FA] border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <label
              htmlFor="difficulty"
              className="text-xs font-black text-black uppercase mb-4"
            >
              Difficulty: <span className="text-[#6C5CE7]">{difficulty}</span>
            </label>
            <input
              id="difficulty"
              type="range"
              min="1"
              max="3"
              step="1"
              disabled={!host}
              value={
                difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3
              }
              onChange={handleDifficultyChange}
              className={`w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-black ${
                !host ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <div className="flex justify-between mt-3 text-[10px] font-black uppercase text-gray-500">
              <span className={difficulty === "Easy" ? "text-black" : ""}>
                Easy
              </span>
              <span className={difficulty === "Medium" ? "text-black" : ""}>
                Medium
              </span>
              <span className={difficulty === "Hard" ? "text-black" : ""}>
                Hard
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
            <button
              onClick={copyCodeToClipboard}
              className="flex-1 bg-[#FFD700] border-4 border-black py-4 px-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
            >
              <span className="text-sm font-black uppercase">
                {copied ? "Copied!" : "Invite Code"}
              </span>{" "}
              <FiClipboard size={20} strokeWidth={3} />
            </button>

            <button
              onClick={getQuiz}
              className={`flex-[1.5] border-4 border-black py-4 px-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest text-xl transition-all ${
                host
                  ? "bg-[#4ECDC4] text-black active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Starting..." : "Start Game"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameSetting;
