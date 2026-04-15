# 🎮 Kuizu | Multiplayer Quiz Game

Kuizu is a real-time quiz game built with React that supports both **single-player** and **multiplayer gameplay**. It uses WebSockets for live interaction and AI/APIs to generate quiz questions dynamically.

---

## 🚀 Features

### 🎯 Single Player Modes

- **Classic Mode** – fixed 10 questions, score-based
- **Survival Mode** – 3 lives, play until eliminated
- **Time Attack** – race against time with bonuses/penalties

---

### 🎮 Multiplayer Mode

- Create or join rooms with a unique code
- Real-time synced gameplay
- Live leaderboard and scoring
- Host controls:
  - Start / restart game
  - Kick players
  - Change settings (difficulty, timer, questions)

---

### 💬 Chat System

- Real-time messaging during gameplay
- System messages (join, leave, host updates)
- Auto-scroll + message trimming

---

### 🧠 Quiz Engine

- Fetches questions from API / Gemini backend
- Supports:
  - Category selection
  - Difficulty levels
  - Custom question count

---

### 🎨 UI / UX

- Neubrutalist design
- Fully responsive (mobile + desktop)
- Avatar selection with local storage
- Smooth transitions and feedback

---

## 📂 Project Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── home.jsx
│   │   ├── singlePlayer.jsx
│   │   ├── multiPlayer.jsx
│   │   ├── lobby.jsx
│   │   ├── quizWindow.jsx
│   │   ├── chatbox.jsx
│   │   ├── playerList.jsx
│   │   ├── waitingScreen.jsx
│   │   ├── joinRoom.jsx
│   │   ├── chooseAvtar.jsx
│   │   ├── gameSetting.jsx
│   │   ├── mobileChat.jsx
│   │   ├── images.jsx
│   │   └── logo.jsx
│   ├── App.js
│   ├── index.js
│   ├── server.js
│   └── websocket.js
```

---

## ⚙️ Setup

```bash
npm install
npm start
```

Runs on:

```
http://localhost:3000
```

---

## 🛠 Tech Stack

- React
- React Router
- WebSockets
- Tailwind CSS
- React Toastify
- Gemini / Quiz API

---

## ⚠️ Limitations

- Requires backend server + WebSocket connection
- Depends on external APIs for quiz data
- Multiplayer sync depends on network latency

---

## 📌 Future Improvements

- Better animations and sound effects
- Improved mobile multiplayer UI
- Persistent leaderboard
- Game history

---

## 👨‍💻 Authors

- Parth Dudani
- Divyansh Maheshwari
