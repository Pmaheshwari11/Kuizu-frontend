import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiClipboard, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { getGeminiQuiz } from "../server";
import Logo from "./logo";
import { useWebSocket } from "../websocket";
import he from "he";

function Lobby() {
  const { partyCode } = useParams();
  const roomCode = atob(partyCode);
  const [mode, setMode] = useState("Survival");
  const [players, setPlayers] = useState([]); // State to store player list
  const [messages, setMessages] = useState([]); // State to store chat messages
  const { socket, connected } = useWebSocket();
  const [copied, setCopied] = useState(false);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [host, setHost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [noOfQuestion, setNoOfQuestion] = useState(10);
  const [timer, setTime] = useState(60);
  const [category, setCategory] = useState("All");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) {
      // Listen to player updates and update the player list
      socket.on("partyUpdated", (players) => {
        setPlayers(players); // Update player list state
      });

      // Listen to new messages and update the chat messages
      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: data.sender, message: data.message },
        ]);
      });

      socket.on("pointsUpdated", (players) => {
        setPlayers(players); // Update player list state
      });

      socket.on("questionsUpdated", (questionsList) => {
        setQuestionsArray(questionsList); // Set the fetched questions
        setIsGameActive(true); // Start the game
      });
    }

    return () => {
      if (connected) {
        socket.off("partyUpdated");
        socket.off("receiveMessage");
        socket.off("pointsUpdated");
        socket.off("questionsUpdated");
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
  }, [messages]);

  useEffect(() => {
    // Check if the current player is the host (assuming first player is host)
    const host = players[0]?.id === socket.id;
    setHost(host);
    console.log(host);
  }, [players, socket.id]);

  function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (!roomCode || !message) {
      alert("You must be in a party to send messages.");
      return;
    }

    socket.emit("sendMessage", roomCode, username, message);
    messageInput.value = ""; // Clear input after sending
  }

  const images = [
    "/Assets/avatar1.png",
    "/Assets/avatar2.png",
    "/Assets/avatar3.png",
    "/Assets/avatar4.png",
    "/Assets/avatar5.png",
    "/Assets/avatar6.png",
  ];

  const handleModeChange = (newMode) => setMode(newMode);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleNoOfQuestionsChange = (e) =>
    setNoOfQuestion(Number(e.target.value));
  const handleDifficultyChange = (e) => {
    const sliderValue = Number(e.target.value);
    // Update difficulty as a string based on slider value
    setDifficulty(
      sliderValue === 1 ? "Easy" : sliderValue === 2 ? "Medium" : "Hard"
    );
  };
  const handleTimerChange = (e) => setTime(Number(e.target.value));

  async function getQuiz() {
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

  function handleAnswer(selectedOption) {
    const points = 10;
    if (currentQuestion.correctOption === selectedOption) {
      toast.success("Correct Answer");
      socket.emit("updatePoints", roomCode, username, points);
    }

    // Move to the next question
    if (questionNumber < questionsArray.length - 1) {
      setQuestionNumber(questionNumber + 1);
    } else {
      isGameActive(false);
    }
  }

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

      <div className="flex gap-10 w-full max-w-screen-xl mt-10">
        {/* Player List on Left */}
        <div className="w-1/4 bg-[#e3e3e337] p-6 rounded-lg shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Players
          </h2>
          <ul id="playerList" className="text-black">
            {players.map((player, index) => (
              <li key={player.id || player.name} className="text-lg mb-4">
                <div className="flex items-center justify-start gap-6 bg-white p-4 rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <img
                    src={images[player.img]}
                    alt="Avatar"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-black">
                      {player.name}
                      {index === 0 && (
                        <span className="ml-2 text-blue-500 font-medium">
                          (Host)
                        </span>
                      )}
                    </span>
                    <span className="text-gray-700 text-lg">
                      Points: {player.points}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {!isGameActive ? (
          <>
            {/* Game Settings and Chat on Right */}
            <div className="flex flex-col gap-5 justify-end">
              <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-full max-w-lg mt-10 flex flex-col items-center gap-5">
                <h2 className="text-3xl font-bold text-center text-black mb-6">
                  Choose Your Fun!
                </h2>

                <div className="grid grid-cols-3 gap-6">
                  <span
                    onClick={() => handleModeChange("Survival")}
                    className={`bg-gradient-to-r from-yellow-400 to-orange-400 text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all text-center ${
                      mode === "Survival"
                        ? "border-[3px] border-black rounded-[10px] text-black"
                        : "text-white"
                    }`}
                  >
                    🛡️ Survival Mode
                  </span>

                  <span
                    onClick={() => handleModeChange("Time Attack")}
                    className={`bg-gradient-to-r from-pink-400 to-purple-500 text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all text-center ${
                      mode === "Time Attack"
                        ? "border-[3px] border-black rounded-[10px] text-black"
                        : "text-white"
                    }`}
                  >
                    ⏱️ Time Attack
                  </span>

                  <span
                    onClick={() => handleModeChange("Classic")}
                    className={`bg-gradient-to-r from-blue-400 to-teal-500 text-xl font-semibold px-10 py-6 rounded-lg shadow-lg hover:from-blue-500 hover:to-teal-600 transform hover:scale-105 transition-all text-center ${
                      mode === "Classic"
                        ? "border-[3px] border-black rounded-[10px] text-black"
                        : "text-white"
                    }`}
                  >
                    🕹️ Classic Mode
                  </span>
                </div>

                <div className="flex flex-col gap-6 w-full">
                  {/* Category Dropdown */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="category"
                      className="text-lg font-semibold text-black mb-2"
                    >
                      Choose Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={handleCategoryChange}
                      className=" text-black font-semibold px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All</option>
                      <option value="Sports">Sports</option>
                      <option value="Cinema">Cinema</option>
                      <option value="Maths">Maths</option>
                      <option value="Geography">Geography</option>
                      <option value="Apptitude">Apptitude</option>
                      <option value="Anime">Anime</option>
                    </select>
                  </div>

                  {/* Number of Questions Dropdown */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="questions"
                      className="text-lg font-semibold text-black mb-2"
                    >
                      Number of Questions
                    </label>
                    <select
                      id="questions"
                      value={noOfQuestion}
                      onChange={handleNoOfQuestionsChange}
                      className=" text-black font-semibold px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                      <option value="30">30</option>
                    </select>
                  </div>

                  {/* Timer Dropdown */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="timer"
                      className="text-lg font-semibold text-black mb-2"
                    >
                      Time per Question (Seconds)
                    </label>
                    <select
                      id="timer"
                      value={timer}
                      onChange={handleTimerChange}
                      className=" text-black font-semibold px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                      <option value="30">30</option>
                      <option value="35">35</option>
                      <option value="40">40</option>
                      <option value="45">45</option>
                      <option value="50">50</option>
                      <option value="55">55</option>
                      <option value="60">60</option>
                    </select>
                  </div>

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
                      value={
                        difficulty === "Easy"
                          ? 1
                          : difficulty === "Medium"
                          ? 2
                          : 3
                      }
                      onChange={handleDifficultyChange}
                      className="slider rounded-lg appearance-none"
                    />
                    <div className="flex justify-between mt-2">
                      <span>Easy</span>
                      <span>Medium</span>
                      <span>Hard</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 justify-center text-center text-white">
                    <div className="flex items-center justify-center text-center text-white">
                      {/* Copy Button Container */}
                      <button
                        onClick={copyCodeToClipboard}
                        className="bg-blue-500 text-black py-3 px-8 rounded-xl shadow-lg flex items-center gap-4 transform hover:scale-105 transition-all"
                      >
                        {/* Button Text */}
                        <span className="text-xl font-semibold">
                          {copied ? "Copied" : "Click to copy code"}
                        </span>
                        {/* Clipboard Icon */}
                        <FiClipboard size={30} />
                      </button>
                    </div>

                    {/* Start Game Button */}
                    <button
                      onClick={getQuiz}
                      readOnly={!host}
                      className="bg-green-500 text-white font-bold px-10 py-4 rounded-lg shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all"
                    >
                      {loading ? "Starting..." : "Start Game"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center flex flex-col space-y-6">
              <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-inner">
                <div className="flex flex-col items-center">
                  <h2 className="text-lg font-bold text-blue-600">Score</h2>
                  <span className="text-3xl font-extrabold text-gray-900"></span>
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
                  {currentQuestion.question || "Loading..."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index + 1)} // Passing option number (1-4)
                    className="bg-gray-200 py-3 px-4 rounded-lg shadow-md hover:bg-gray-300"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Chat Box */}
        <div className="bg-[#e3e3e337] p-6 rounded-lg shadow-2xl w-1/4">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Chat
          </h2>
          <div
            id="chatBox"
            className="h-64 overflow-y-auto bg-white p-4 rounded-lg mb-4"
          >
            {messages.map((msg, index) => (
              <p key={index} className="text-black break-words">
                <strong>{msg.sender}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            id="messageInput"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
              }
            }}
            className="w-full p-3 bg-white rounded-lg"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg"
          >
            Send
          </button>
        </div>
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
