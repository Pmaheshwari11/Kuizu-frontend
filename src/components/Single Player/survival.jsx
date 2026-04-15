import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getQuiz } from "../../server";
import he from "he";

function SP_SURVIVAL() {
  const [showRules, setShowRules] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState(0);
  const [personalBest, setPersonalBest] = useState(() => {
    return parseInt(localStorage.getItem("personalBestSurvival")) || 0;
  });
  const [lives, setLives] = useState(3);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [loading, setLoading] = useState(false);

  const startGame = async () => {
    setRestarting(true);
    setLoading(true);
    try {
      const quizData = await getQuiz();
      if (quizData?.results && quizData.results.length > 0) {
        setQuestions(quizData.results);
        setQuestion(he.decode(quizData.results[0]?.question));
        setRestarting(false);
        setScore(0);
        setLives(3);
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
      setLoading(false);
    }
  };

  const fetchNewQuestions = async () => {
    if (questions.length <= questionNumber + 5) {
      try {
        const quizData = await getQuiz();
        if (quizData?.results && quizData.results.length > 0) {
          setQuestions((prevQuestions) => [
            ...prevQuestions,
            ...quizData.results,
          ]);
        }
      } catch (error) {
        console.error("Error fetching new questions:", error);
      }
    }
  };

  const fetchNewQuestion = (index) => {
    if (index < questions.length) {
      setQuestion(he.decode(questions[index]?.question));
    }
  };

  useEffect(() => {
    localStorage.setItem("personalBestSurvival", personalBest);
  }, [personalBest]);

  const updateScore = () => {
    if (!isGameActive) return;
    setScore((prevScore) => prevScore + 10);
    toast.dismiss();
    toast.success("+10 Points");
    if (score + 10 > personalBest) {
      setPersonalBest(score + 10);
    }
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
      setLives((prev) => prev - 1);
      toast.dismiss();
      toast.error("Wrong Answer! Lives Left: " + (lives - 1));
      if (lives - 1 <= 0) {
        setIsGameActive(false);
        toast.dismiss();
        toast.error("Game Over! No lives left.");
      }
    }
    const nextQuestionNumber = questionNumber + 1;
    setQuestionNumber(nextQuestionNumber);
    fetchNewQuestion(nextQuestionNumber);
    fetchNewQuestions();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFEFD5] p-6 relative">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <a
        href="/singlePlayer"
        className="absolute top-6 left-6 z-50 bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <FiArrowLeft size={30} color="black" strokeWidth={3} />
      </a>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[100]">
          <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center animate-bounce">
            <img
              src="/Assets/loading.png"
              alt="Loading..."
              className="animate-spin h-24 w-24 mx-auto mb-4"
            />
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Loading...
            </h3>
          </div>
        </div>
      )}

      {showRules ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center">
            <h2 className="text-4xl font-black mb-6 text-black uppercase italic tracking-tighter">
              Survival Rules
            </h2>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center gap-3 font-bold text-lg">
                <span className="text-3xl">❤️</span> Start with 3 lives.
              </li>
              <li className="flex items-center gap-3 font-bold text-lg">
                <span className="text-3xl">🎯</span> Each correct answer is +10.
              </li>
              <li className="flex items-center gap-3 font-bold text-lg">
                <span className="text-3xl">⚡</span> Don't let your lives hit
                zero!
              </li>
            </ul>
            <button
              onClick={startGame}
              className="w-full bg-[#4ECDC4] border-4 border-black text-black text-2xl font-black py-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all uppercase"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-xl relative z-10">
          {isGameActive ? (
            <>
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-[#FFD700] border-4 border-black p-2 rounded-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-black uppercase">Score</p>
                  <p className="text-2xl font-black">{score}</p>
                </div>
                <div className="bg-white border-4 border-black p-2 rounded-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-black uppercase">Lives</p>
                  <div className="flex justify-center gap-1 mt-1">
                    {[...Array(lives)].map((_, i) => (
                      <span key={i} className="text-xl">
                        ❤️
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-[#4ECDC4] border-4 border-black p-2 rounded-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-black uppercase">Best</p>
                  <p className="text-2xl font-black">{personalBest}</p>
                </div>
              </div>

              {/* Question Box */}
              <div className="mb-8">
                <p className="text-sm font-black uppercase text-gray-400 mb-1">
                  Question #{questionNumber + 1}
                </p>
                <div className="bg-black text-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(78,205,196,1)]">
                  <p className="text-xl md:text-2xl font-bold leading-tight">
                    {question || "Loading..."}
                  </p>
                </div>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions.length > 0 &&
                  (questions[questionNumber]?.incorrect_answers?.length > 0
                    ? [
                        ...questions[questionNumber]?.incorrect_answers,
                        questions[questionNumber]?.correct_answer,
                      ]
                    : [questions[questionNumber]?.correct_answer]
                  )
                    .filter(Boolean)
                    .sort(() => Math.random() - 0.5)
                    .map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(he.decode(answer))}
                        className="bg-white border-4 border-black py-4 px-4 rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFEFD5] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-left"
                      >
                        <span className="inline-block mr-2 text-gray-400">
                          {index + 1}.
                        </span>
                        {he.decode(answer)}
                      </button>
                    ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-5xl font-black text-[#FF6B6B] uppercase italic tracking-tighter mb-4">
                Game Over!
              </h3>
              <div className="bg-black text-white p-6 rounded-2xl border-4 border-black mb-8 inline-block px-12 shadow-[8px_8px_0px_0px_rgba(255,107,107,1)]">
                <p className="text-lg font-bold uppercase">Final Score</p>
                <p className="text-6xl font-black">{score}</p>
              </div>
              <button
                onClick={startGame}
                disabled={restarting}
                className="block w-full bg-[#FFD700] border-4 border-black text-black py-4 rounded-2xl text-2xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all uppercase"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={800}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        limit={1}
      />
    </div>
  );
}

export default SP_SURVIVAL;
