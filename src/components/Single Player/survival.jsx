import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SP_SURVIVAL() {
  const [personalBest, setPersonalBest] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [question, setQuestion] = useState("Loading question...");
  const [score, setScore] = useState(0);

  // Load personal best from localStorage
  useEffect(() => {
    const storedBest = localStorage.getItem("personalBestSurvival");
    if (storedBest) setPersonalBest(parseInt(storedBest));
  }, []);

  // Function to start the game (close rules popup)
  const startGame = () => {
    setShowRules(false);
    setScore(0);
    fetchNewQuestion();
  };

  // Fetch new question (Placeholder logic, replace with API or logic later)
  const fetchNewQuestion = () => {
    setQuestion("What is 2 + 2?"); // Replace with real logic
  };

  // Update score and check personal best
  const updateScore = () => {
    const newScore = score + 10;
    setScore(newScore);
    if (newScore > personalBest) {
      setPersonalBest(newScore);
      localStorage.setItem("personalBestSurvivals", newScore);
    }
  };
  const gameOver = () => {
    const newScore = 0;
    setScore(newScore);
    toast.error("Game Over");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 "
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <a
        href="/singlePlayer"
        className="absolute top-4 left-4 rounded-2xl bg-[#d2d1d142]"
      >
        <FiArrowLeft size={30} />
      </a>
      {/* Game Rules Popup */}
      {showRules && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
              Survival Mode Rules
            </h2>
            <ul className="text-left list-disc pl-6 space-y-2 text-gray-700">
              <li>Answer correctly to keep playing.</li>
              <li>Each correct answer increases your score.</li>
              <li>Game ends when you answer incorrectly.</li>
            </ul>
            <button
              onClick={startGame}
              className="mt-6 bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {!showRules && (
        <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg text-center flex flex-col space-y-6">
          {/* Score & Personal Best */}
          <div className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-inner">
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-bold text-blue-600">Score</h2>
              <span className="text-2xl font-extrabold text-gray-900">
                {score}
              </span>
            </div>
            <div className="border-l-2 border-gray-300"></div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-green-600">
                Personal Best
              </h3>
              <span className="text-2xl font-extrabold text-gray-900">
                {personalBest}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-lg border border-blue-300 animate-fadeIn">
            <h3 className="text-xl font-semibold text-blue-800">Question</h3>
            <p className="mt-2 text-lg font-medium text-gray-900">{question}</p>
          </div>

          {/* Answer Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={updateScore}
              className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
            >
              Correct (+5s)
            </button>
            <button
              onClick={gameOver}
              className="bg-red-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
            >
              Wrong (-5s)
            </button>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={500}
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

export default SP_SURVIVAL;
