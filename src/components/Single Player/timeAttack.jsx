import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SP_TIME() {
  const [personalBest, setPersonalBest] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [question, setQuestion] = useState("Loading question...");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Start with 60 seconds
  const [isGameActive, setIsGameActive] = useState(false);

  // Load personal best from localStorage
  useEffect(() => {
    const storedBest = localStorage.getItem("personalBestTimeAttack");
    if (storedBest) setPersonalBest(parseInt(storedBest));
  }, []);

  // Timer logic
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft <= 0) gameOver();
  }, [isGameActive, timeLeft]);

  // Function to start the game (closes rules popup & starts timer)
  const startGame = () => {
    setShowRules(false);
    setScore(0);
    setTimeLeft(60);
    setIsGameActive(true);
    fetchNewQuestion();
  };

  // Fetch new question (Placeholder logic, replace with API or logic later)
  const fetchNewQuestion = () => {
    setQuestion("What is 2 + 2?"); // Replace with real logic
  };

  // Update score, increase time, check personal best
  const updateScore = () => {
    if (!isGameActive) return;

    setScore((prevScore) => prevScore + 10);
    setTimeLeft((prevTime) => Math.min(prevTime + 5, 60));
    toast.success("+5 Seconds");

    if (score + 10 > personalBest) {
      setPersonalBest(score + 10);
      localStorage.setItem("personalBestTimeAttack", score + 10);
    }

    fetchNewQuestion();
  };

  // Wrong answer reduces time
  const wrongAnswer = () => {
    if (!isGameActive) return;

    setTimeLeft((prevTime) => Math.max(prevTime - 5, 0));
    toast.error("-5 Seconds");
    fetchNewQuestion();
  };

  // Game Over
  const gameOver = () => {
    setIsGameActive(false);
    toast.error("Time’s up! Game Over.");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <a
        href="/singlePlayer"
        className="absolute top-4 left-4 bg-[#d2d1d142] p-2 rounded-xl"
      >
        <FiArrowLeft size={30} />
      </a>

      {/* Game Rules Popup */}
      {showRules && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
              Time Attack Rules
            </h2>
            <ul className="text-left list-disc pl-6 space-y-2 text-gray-700">
              <li>Game starts with 60 seconds.</li>
              <li>Each correct answer adds +5 sec.</li>
              <li>Each wrong answer subtracts -5 sec.</li>
              <li>Game ends when time reaches 0.</li>
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
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center flex flex-col space-y-6">
          {/* Score & Time Section */}
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-inner">
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-bold text-blue-600">Score</h2>
              <span className="text-3xl font-extrabold text-gray-900">
                {score}
              </span>
            </div>
            <div className="border-l-2 border-gray-300"></div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-green-600">
                Personal Best
              </h3>
              <span className="text-3xl font-extrabold text-gray-900">
                {personalBest}
              </span>
            </div>
          </div>

          {/* Timer Display */}
          <h4
            className={`text-3xl font-extrabold ${
              timeLeft < 10 ? "text-red-600" : "text-green-600"
            } mt-4`}
          >
            Time Left: {timeLeft}s
          </h4>

          {/* Question Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-300">
            <h3 className="text-xl font-semibold text-blue-800">Question</h3>
            <p className="mt-2 text-lg font-medium text-gray-900">{question}</p>
          </div>

          {/* Answer Buttons */}
          <div className="flex justify-center space-x-6 mt-6">
            <button
              onClick={updateScore}
              className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
            >
              Correct (+5s)
            </button>
            <button
              onClick={wrongAnswer}
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

export default SP_TIME;
