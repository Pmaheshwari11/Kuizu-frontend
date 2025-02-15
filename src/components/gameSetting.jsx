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
    "text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="flex flex-col gap-5 justify-end">
      <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-full max-w-lg mt-10 flex flex-col items-center gap-5">
        <h2 className="text-3xl font-bold text-center text-black">
          Choose Your Fun!
        </h2>

        <div className="flex flex-col gap-6 w-full">
          {/* Dropdowns */}
          {[
            {
              label: "Choose Category",
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
              label: "Number of Questions",
              id: "questions",
              value: noOfQuestion,
              onChange: handleNoOfQuestionsChange,
              options: ["10", "15", "20", "25", "30"],
            },
            {
              label: "Time per Question (Seconds)",
              id: "timer",
              value: time,
              onChange: handleTimerChange,
              options: ["5", "10", "15", "20"],
            },
          ].map(({ label, id, value, onChange, options }) => (
            <div key={id} className="flex flex-col">
              <label
                htmlFor={id}
                className="text-lg font-semibold text-black mb-2"
              >
                {label}
              </label>
              <select
                id={id}
                value={value}
                disabled={!host}
                onChange={onChange}
                className={`${commonSelectClass} ${
                  host ? "hover:scale-105" : "cursor-not-allowed"
                }`}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Difficulty Slider */}
          <div className="flex flex-col">
            <label
              htmlFor="difficulty"
              className="text-lg font-semibold text-black mb-2"
            >
              Difficulty Level
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
              className={`slider rounded-lg ${
                host ? "" : "cursor-not-allowed"
              }`}
            />
            <div className="flex justify-between mt-2">
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-5 justify-center">
            <button
              onClick={copyCodeToClipboard}
              className="bg-blue-500 text-black py-3 px-8 rounded-xl shadow-lg flex items-center gap-4 transform hover:scale-105 transition-all"
            >
              <span className="text-xl font-semibold">
                {copied ? "Copied" : "Click to copy code"}
              </span>{" "}
              <FiClipboard size={30} />
            </button>
            <button
              onClick={getQuiz}
              className={`px-10 py-4 rounded-lg shadow-lg font-bold text-white transform hover:scale-105 transition-all ${
                host
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-green-800 cursor-not-allowed"
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
