import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getQuiz } from "../../server"; // Fetch the quiz data (add this function in your backend to return quiz data)
import he from "he";

function SP_TIME() {
  const [personalBest, setPersonalBest] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("Loading question...");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Start with 60 seconds
  const [isGameActive, setIsGameActive] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [restarting, setRestarting] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading popup

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

    // If time runs out, stop the game
    if (timeLeft <= 0 && isGameActive) {
      setIsGameActive(false);
      toast.error("Time’s up! Game Over.");
    }
  }, [isGameActive, timeLeft]);

  const startGame = async () => {
    setRestarting(true);
    setLoading(true); // Show the loading popup when game starts or restarts
    try {
      const quizData = await getQuiz();
      if (quizData?.results && quizData.results.length > 0) {
        setQuestions(quizData.results);
        setQuestion(he.decode(quizData.results[0]?.question));
        shuffleAnswers(quizData.results[0]);
        setRestarting(false);
        setScore(0);
        setTimeLeft(60);
        setQuestionNumber(0);
        setIsGameActive(true);
        setShowRules(false);
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

  const fetchNewQuestions = async () => {
    if (questions.length <= questionNumber + 5) {
      // Fetch new questions if 5 or fewer remain
      try {
        const quizData = await getQuiz();
        if (quizData?.results && quizData.results.length > 0) {
          setQuestions((prevQuestions) => [
            ...prevQuestions,
            ...quizData.results,
          ]);
        } else {
          toast.error("No more questions available.");
        }
      } catch (error) {
        console.error("Error fetching new questions:", error);
        toast.error("Error fetching new questions. Please try again later.");
      }
    }
  };

  const shuffleAnswers = (currentQuestion) => {
    if (currentQuestion?.incorrect_answers) {
      const allAnswers = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];
      const shuffled = allAnswers.sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
    }
  };

  // Fetch next question
  const fetchNewQuestion = (index) => {
    if (index < questions.length) {
      setQuestion(he.decode(questions[index]?.question));
      shuffleAnswers(questions[index]);
    }
  };

  const updateScore = () => {
    if (!isGameActive) return;
    setScore((prevScore) => prevScore + 10);
    setTimeLeft((prevTime) => Math.min(prevTime + 5, 60)); // Add 5 seconds for correct answer
    toast.success("+5 Seconds");

    if (score + 10 > personalBest) {
      setPersonalBest(score + 10);
      localStorage.setItem("personalBestTimeAttack", score + 10);
    }

    const nextQuestionNumber = questionNumber + 1;
    setQuestionNumber(nextQuestionNumber);
    fetchNewQuestion(nextQuestionNumber);
    fetchNewQuestions(); // Fetch new questions if needed
  };

  const wrongAnswer = () => {
    if (!isGameActive) return;
    setTimeLeft((prevTime) => prevTime - 5);
    const nextQuestionNumber = questionNumber + 1;
    setQuestionNumber(nextQuestionNumber);
    fetchNewQuestion(nextQuestionNumber);
  };

  const handleAnswerClick = (answer) => {
    if (
      questions.length > 0 &&
      he.decode(answer) === he.decode(questions[questionNumber]?.correct_answer)
    ) {
      updateScore();
    } else {
      wrongAnswer();
      toast.error("-5 Seconds");
    }
    const nextQuestionNumber = questionNumber + 1;
    setQuestionNumber(nextQuestionNumber);
    fetchNewQuestion(nextQuestionNumber);
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
              src="/assets/loading.png" // Replace with your loading image path
              alt="Loading..."
              className="animate-spin h-32 w-32 mx-auto"
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Loading...
            </h3>
          </div>
        </div>
      )}

      {/* Game Rules Popup */}
      {showRules ? (
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
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center flex flex-col space-y-6">
          {isGameActive ? (
            <>
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
                <h3 className="text-xl font-semibold text-blue-800">
                  Question
                </h3>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  {question}
                </p>
              </div>
              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {shuffledAnswers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(he.decode(answer))}
                    className="bg-gray-200 py-3 px-4 rounded-lg shadow-md hover:bg-gray-300"
                  >
                    {he.decode(answer)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
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
      />
    </div>
  );
}

export default SP_TIME;
