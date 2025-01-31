import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SP_CLASSIC() {
  const [showRules, setShowRules] = useState(true);
  const [question, setQuestion] = useState("Loading question...");
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0); // Track the question number
  const [isGameActive, setIsGameActive] = useState(false);

  // Function to start the game (closes rules popup & starts the game)
  const startGame = () => {
    setShowRules(false);
    setScore(0);
    setQuestionNumber(0); // Reset question count
    setIsGameActive(true);
    fetchNewQuestion();
  };

  // Fetch new question (Placeholder logic, replace with API or logic later)
  const fetchNewQuestion = () => {
    setQuestion("What is 2 + 2?"); // Replace with real logic
  };

  // Update score, check if game is over
  const updateScore = () => {
    if (!isGameActive || questionNumber >= 10) return; // No update after 10 questions

    setScore((prevScore) => prevScore + 10); // Increase score on correct answer
    toast.success("+10 Points");

    setQuestionNumber((prevNumber) => prevNumber + 1); // Move to next question
    if (questionNumber + 1 === 10) {
      gameOver(); // End game after 10 questions
    } else {
      fetchNewQuestion(); // Get next question
    }
  };

  // Game Over
  const gameOver = () => {
    setIsGameActive(false);
    toast.error("Game Over! You've answered all the questions.");
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
              Classic Mode Rules
            </h2>
            <ul className="text-left list-disc pl-6 space-y-2 text-gray-700">
              <li>Game has 10 questions.</li>
              <li>Each correct answer adds +10 points.</li>
              <li>No negative points.</li>
              <li>Game ends after 10 questions.</li>
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
          {/* Score & Question Number Section */}
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-inner">
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-bold text-blue-600">Score</h2>
              <span className="text-3xl font-extrabold text-gray-900">
                {score}
              </span>
            </div>
            <div className="border-l-2 border-gray-300"></div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-green-600">Max Score</h3>
              <span className="text-3xl font-extrabold text-gray-900">100</span>
            </div>
          </div>

          {/* Question Number */}
          <h4 className="text-2xl font-extrabold text-gray-800 mt-4">
            Question {questionNumber + 1} of 10
          </h4>

          {/* Question Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-300">
            <h3 className="text-xl font-semibold text-blue-800">Question</h3>
            <p className="mt-2 text-lg font-medium text-gray-900">{question}</p>
          </div>

          {/* Answer Button */}
          <div className="flex justify-center space-x-6 mt-6">
            <button
              onClick={updateScore}
              className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
            >
              Correct (+10)
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

export default SP_CLASSIC;
