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
  const [players, setPlayers] = useState([]); // State to store player list
  const [messages, setMessages] = useState([]); // State to store chat messages
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
  const intervalRef = useRef(null); // Track interval

  useEffect(() => {
    if (connected) {
      // Listen to player updates and update the player list
      socket.on("partyUpdated", (party) => {
        setPlayers(party.players); // Update player list state
        setHost(party.host === socket.id);
      });

      // Listen to new messages and update the chat messages
      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: data.sender, code: data.code, message: data.message },
        ]);
      });

      socket.on("pointsUpdated", (players) => {
        setPlayers(players); // Update player list state
      });

      socket.on("questionsUpdated", (questionsList) => {
        setQuestionsArray(questionsList); // Set the fetched questions
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

      socket.on("syncTimer", (newTime) => {
        setTimer(newTime);
      });

      socket.on("nextQuestion", (newQuestionIndex) => {
        setQuestionNumber(newQuestionIndex);
        setTimer(time); // Reset timer
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
  }, [connected, socket, roomCode]);

  const copyCodeToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    if (messages.length >= 50) {
      setMessages((prevMessages) => prevMessages.slice(1)); // Remove the first message
    }
  }, [messages]);

  function sendMessage(message) {
    const trimmedMessage = message.trim();

    if (!roomCode || !trimmedMessage) {
      alert("You must be in a party to send messages.");
      return;
    }

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
    socket.emit("updateDifficulty", roomCode, Number(e.target.value));
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
    const data = {
      noOfQuestion: noOfQuestion,
      difficulty: difficulty,
      topic: category,
    };
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
        toast.error("Failed to load questions. Try again!");
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error("Error fetching quiz data. Please try again later.");
    } finally {
      setLoading(false); // Hide the loading popup after the game starts
    }
  }

  const handleAnswer = (selectedOption) => {
    if (gameState !== "started") return; // Prevent multiple answers

    setSelectedOption(selectedOption); // Store selected option
    setIsAnswered(true); // Disable further answering
    let timeLeft = time - timer;
    timeLeft = time - timeLeft;;

    const maxPoints = 100; // Maximum possible points
    const minPoints = 30; // Minimum points for correct answer
    const timeFactor = timeLeft / time; // Fraction of time left (0 to 1)
    const points = Math.round(minPoints + (maxPoints - minPoints) * timeFactor);
    if (questionsArray[questionNumber].correctOption === selectedOption) {
      toast.success("Correct Answer");
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
    if (gameState !== "started") return; // Don't start the timer if the game isn't active

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (questionNumber < questionsArray.length - 1) {
            setQuestionNumber((prevQ) => prevQ + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            return time; // Reset timer
          } else {
            setGameState("waiting");
            setTimer(time);
            setMessages([]);
            setSelectedOption(null);
            setIsAnswered(false);
            setQuestionNumber(0);
            return 0; // Stop the timer
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current); // Cleanup on re-renders
  }, [gameState, questionNumber, time]); // Dependencies updated

  const currentQuestion = questionsArray[questionNumber];

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/Assets/background.png)" }}
    >
      <button
        onClick={() => {
          socket.emit("leaveParty", roomCode);
          navigate("/multiplayer");
        }}
        className="fixed left-4 rounded-2xl bg-[#d2d1d142] z-10"
      >
        <FiArrowLeft size={30} />
      </button>
      <Logo />

      <div className="flex flex-col sm:flex-row gap-10 w-full max-w-screen-xl mt-10">
        {/* Player List on Left */}
        <PlayerList
          players={players}
          host={host}
          socket={socket}
          images={images}
          handleKick={handleKick}
        />
        {gameState === "newGame" ? (
          <>
            {/* Game Settings and Chat on Right */}
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
          </>
        ) : gameState === "started" ? (
          <>
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
          </>
        ) : (
          <Waiting
            players={players}
            handleGameOver={handleGameOver}
            host={host}
          />
        )}

        {/* Chat Box */}
        <ChatBox messages={messages} sendMessage={sendMessage} />
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
        autoClose={2000}
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

export default Lobby;
