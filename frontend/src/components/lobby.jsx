import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { getGeminiQuiz } from "../server";
import Logo from "./logo";
import { useWebSocket } from "../websocket";
import Waiting from "./waitingScreen";
import MobileChatNPlayer from "./mobileChat";
import ChatBox from "./chatbox";
import GameSetting from "./gameSetting";
import QuizWindow from "./quizWindow";
import PlayerList from "./playerList";
import images from "./images";

function Lobby() {
  const { partyCode } = useParams();
  const roomCode = atob(partyCode);
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const { socket, connected } = useWebSocket();
  const [copied, setCopied] = useState(false);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameState, setGameState] = useState("newGame");
  const [host, setHost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [noOfQuestion, setNoOfQuestion] = useState(10);
  const [time, setTime] = useState(10);
  const [timer, setTimer] = useState(10);
  const [category, setCategory] = useState("All");
  const username = localStorage.getItem("username");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (connected) {
      socket.on("partyUpdated", (party) => {
        setPlayers(party.players);
        setHost(party.host === socket.id);
      });

      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: data.sender, code: data.code, message: data.message },
        ]);
      });

      socket.on("pointsUpdated", (players) => {
        setPlayers(players);
      });

      socket.on("questionsUpdated", (questionsList) => {
        setQuestionsArray(questionsList);
        setGameState("started");
      });

      socket.on("syncTimer", (newTime) => {
        setTime(newTime);
        setTimer(newTime);
      });

      socket.on("syncCategory", (newCategory) => {
        setCategory(newCategory);
      });

      socket.on("syncQuestions", (noOfQuestion) => {
        setNoOfQuestion(noOfQuestion);
      });

      socket.on("syncDifficulty", (difficulty) => {
        setDifficulty(difficulty);
      });

      socket.on("nextQuestion", (newQuestionIndex) => {
        setQuestionNumber(newQuestionIndex);
        setTimer(time);
      });

      socket.on("newGame", () => {
        setQuestionsArray([]);
        setQuestionNumber(0);
        setGameState("newGame");
      });

      socket.on("kicked", (data) => {
        toast.error(data.message);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      });
    }

    return () => {
      if (connected) {
        socket.off("partyUpdated");
        socket.off("receiveMessage");
        socket.off("pointsUpdated");
        socket.off("questionsUpdated");
        socket.off("newGame");
        socket.off("kicked");
      }
    };
  }, [connected, socket, roomCode, time, navigate]);

  const copyCodeToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    if (messages.length >= 50) {
      setMessages((prevMessages) => prevMessages.slice(1));
    }
  }, [messages]);

  function sendMessage(message) {
    const trimmedMessage = message.trim();
    if (!roomCode || !trimmedMessage) return;
    socket.emit("sendMessage", roomCode, username, trimmedMessage);
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    socket.emit("updateCategory", roomCode, e.target.value);
  };

  const handleNoOfQuestionsChange = (e) => {
    setNoOfQuestion(Number(e.target.value));
    socket.emit("updateQuestions", roomCode, e.target.value);
  };

  const handleDifficultyChange = (e) => {
    const sliderValue = Number(e.target.value);
    const newDifficulty =
      sliderValue === 1 ? "Easy" : sliderValue === 2 ? "Medium" : "Hard";
    setDifficulty(newDifficulty);
    socket.emit("updateDifficulty", roomCode, sliderValue);
  };

  const handleTimerChange = (e) => {
    const newTime = Number(e.target.value);
    setTime(newTime);
    setTimer(newTime);
    socket.emit("updateTimer", roomCode, newTime);
  };

  const handleKick = (playerId) => {
    socket.emit("kickPlayer", roomCode, playerId);
  };

  async function getQuiz() {
    if (!host) {
      toast.error("Only host can start the game");
      return;
    }
    const data = { noOfQuestion, difficulty, topic: category };
    setLoading(true);
    try {
      const response = await getGeminiQuiz(data);
      if (response) {
        const questionsList = Object.keys(response).map((key) => ({
          question: response[key].question,
          options: [
            response[key].option1,
            response[key].option2,
            response[key].option3,
            response[key].option4,
          ],
          correctOption: response[key].correctOption,
        }));
        socket.emit("setQuestions", roomCode, questionsList);
      } else {
        toast.error("Failed to load questions.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching quiz.");
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = (selectedOption) => {
    if (gameState !== "started" || isAnswered) return;

    setSelectedOption(selectedOption);
    setIsAnswered(true);

    const timeLeft = timer;
    const maxPoints = 100;
    const minPoints = 30;
    const timeFactor = timeLeft / time;
    const points = Math.round(minPoints + (maxPoints - minPoints) * timeFactor);

    if (questionsArray[questionNumber].correctOption === selectedOption) {
      toast.success("Correct!");
      socket.emit("adminMessage", roomCode, username);
      socket.emit("updatePoints", roomCode, username, points);
    }
    socket.emit("playerAnswered", roomCode, username);
  };

  const handleGameOver = () => {
    socket.emit("gameOver", roomCode);
    socket.emit("resetPoints", roomCode);
  };

  useEffect(() => {
    if (gameState !== "started") return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (questionNumber < questionsArray.length - 1) {
            setQuestionNumber((prevQ) => prevQ + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            return time;
          } else {
            setGameState("waiting");
            setTimer(time);
            setMessages([]);
            setSelectedOption(null);
            setIsAnswered(false);
            setQuestionNumber(0);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [gameState, questionNumber, time, questionsArray.length]);

  const currentQuestion = questionsArray[questionNumber];

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFEFD5] p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Leave Party Button */}
      <button
        onClick={() => {
          socket.emit("leaveParty", roomCode);
          navigate("/multiplayer");
        }}
        className="fixed left-6 top-6 z-50 bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
        title="Leave Party"
      >
        <FiArrowLeft size={30} color="black" strokeWidth={3} />
      </button>

      <Logo />

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mt-8 relative z-10 items-start justify-center">
        {/* Left Side: Player List */}
        <PlayerList
          players={players}
          host={host}
          socket={socket}
          images={images}
          handleKick={handleKick}
        />

        {/* Center: Main Game Area */}
        {gameState === "newGame" ? (
          <GameSetting
            category={category}
            noOfQuestion={noOfQuestion}
            time={time}
            difficulty={difficulty}
            copied={copied}
            copyCodeToClipboard={copyCodeToClipboard}
            host={host}
            handleCategoryChange={handleCategoryChange}
            handleDifficultyChange={handleDifficultyChange}
            handleNoOfQuestionsChange={handleNoOfQuestionsChange}
            handleTimerChange={handleTimerChange}
            loading={loading}
            getQuiz={getQuiz}
          />
        ) : gameState === "started" ? (
          <QuizWindow
            timer={timer}
            time={time}
            questionNumber={questionNumber}
            noOfQuestion={noOfQuestion}
            currentQuestion={currentQuestion}
            selectedOption={selectedOption}
            isAnswered={isAnswered}
            handleAnswer={handleAnswer}
            category={category}
          />
        ) : (
          <Waiting
            players={players}
            handleGameOver={handleGameOver}
            host={host}
          />
        )}

        {/* Right Side: Chat Box */}
        <ChatBox messages={messages} sendMessage={sendMessage} />

        {/* Mobile Specific Chat & Player List */}
        <MobileChatNPlayer
          players={players}
          images={images}
          host={host}
          socket={socket}
          handleKick={handleKick}
          messages={messages}
          sendMessage={sendMessage}
        />
      </div>

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

export default Lobby;
