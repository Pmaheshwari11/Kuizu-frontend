import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getQuiz } from "../../server";
import he from "he";

function SP_CLASSIC() {
  const [showRules, setShowRules] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading popup

  const startGame = async () => {
    setRestarting(true);
    setLoading(true);
    try {
      const quizData = await getQuiz();
      if (quizData?.results && quizData.results.length > 0) {
        setQuestions(quizData.results); // Set the fetched questions
        setQuestion(he.decode(quizData.results[0]?.question)); // Set first question
        setRestarting(false);
        setScore(0); // Reset score
        setQuestionNumber(0); // Reset question number
        setIsGameActive(true); // Start the game
        setShowRules(false); // Hide rules screen
      } else {
        toast.error("Failed to load questions. Try again!");
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error("Error fetching quiz data. Please try again later.");
    } finally {
      setLoading(false); // Hide the loading popup after the game starts
    }
  };

  const fetchNewQuestion = (index) => {
    if (index < questions.length) {
      setQuestion(he.decode(questions[index]?.question)); // Set next question
    }
  };

  useEffect(() => {
    if (questions.length > 0 && questionNumber < questions.length) {
      setQuestion(he.decode(questions[questionNumber]?.question)); // Update question on change
    }
  }, [questionNumber, questions]);

  const updateScore = () => {
    if (!isGameActive || questionNumber > 9) return;

    setScore((prev) => prev + 10); // Increment score
    toast.success("+10 Points");

    const nextQuestionNumber = questionNumber + 1;
    setQuestionNumber(nextQuestionNumber);

    if (nextQuestionNumber === 10) {
      gameOver();
    } else {
      fetchNewQuestion(nextQuestionNumber);
    }
  };

  const gameOver = () => {
    setIsGameActive(false);
    toast.error("Game Over! You've answered all the questions.");
  };

  const handleAnswerClick = (answer) => {
    if (
      questions.length > 0 &&
      he.decode(answer) === he.decode(questions[questionNumber]?.correct_answer)
    ) {
      updateScore();
    } else {
      toast.error("Wrong Answer!");
      setQuestionNumber((prev) => prev + 1); // Move to the next question after wrong answer
    }
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

      {/* Loading Popup */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <img
              src="/Assets/loading.png" // Replace with your loading image path
              alt="Loading..."
              className="animate-spin h-32 w-32 mx-auto"
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Loading...
            </h3>
          </div>
        </div>
      )}

      {showRules ? (
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
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center flex flex-col space-y-6">
          {questionNumber < 10 ? (
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center flex flex-col space-y-6">
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
                    Max Score
                  </h3>
                  <span className="text-3xl font-extrabold text-gray-900">
                    100
                  </span>
                </div>
              </div>

              <h4 className="text-2xl font-extrabold text-gray-800 mt-4">
                Question {questionNumber + 1} of 10
              </h4>

              <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-300">
                <h3 className="text-xl font-semibold text-blue-800">
                  Question
                </h3>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  {question || "Loading..."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {questions.length > 0 &&
                  (questions[questionNumber]?.incorrect_answers?.length > 0
                    ? [
                        ...questions[questionNumber]?.incorrect_answers,
                        questions[questionNumber]?.correct_answer,
                      ]
                    : [questions[questionNumber]?.correct_answer]
                  )
                    .filter(Boolean) // Filter out any falsy values
                    .sort(() => Math.random() - 0.5) // Shuffle answers
                    .map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(he.decode(answer))}
                        className="bg-gray-200 py-3 px-4 rounded-lg shadow-md hover:bg-gray-300"
                      >
                        {he.decode(answer)}{" "}
                        {/* Decode answer before rendering */}
                      </button>
                    ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center flex flex-col space-y-6">
              <h3 className="text-3xl font-semibold text-red-500">
                Game Over!
              </h3>
              <h4 className="text-xl font-bold text-gray-900 mt-4">
                Your Final Score: {score}
              </h4>
              <button
                onClick={startGame}
                disabled={restarting}
                className="mt-6 bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
              >
                Restart Game
              </button>
            </div>
          )}
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
