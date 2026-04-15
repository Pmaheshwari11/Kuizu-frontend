import React from "react";

function QuizWindow({
  timer,
  time,
  questionNumber,
  noOfQuestion,
  currentQuestion,
  selectedOption,
  isAnswered,
  handleAnswer,
  category,
}) {
  return (
    <div className="bg-white border-4 border-black p-6 md:p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-xl text-center flex flex-col space-y-6 relative z-10">
      {/* Category & Timer */}
      <div className="flex justify-between items-center bg-[#F8F9FA] border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-left">
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
            Category
          </p>
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-black">
            {category}
          </h3>
        </div>

        {/* Stopwatch Container */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">
            Time
          </p>
          <div
            className={`text-3xl font-black flex items-center justify-center w-16 h-16 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300 ${
              timer <= time * 0.25
                ? "bg-[#FF6B6B] text-white"
                : "bg-[#FFD700] text-black"
            }`}
            aria-label={`Time left: ${timer} seconds`}
          >
            <span className="tabular-nums">{timer}</span>
          </div>
        </div>
      </div>

      {/* Question Progress */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-3 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6C5CE7] transition-all duration-500"
            style={{ width: `${((questionNumber + 1) / noOfQuestion) * 100}%` }}
          ></div>
        </div>
        <span className="text-sm font-black uppercase whitespace-nowrap">
          {questionNumber + 1} / {noOfQuestion}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-black text-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(78,205,196,1)]">
        <h3 className="text-xs font-black uppercase text-[#4ECDC4] mb-2 tracking-widest text-left">
          The Question
        </h3>
        <p className="text-xl md:text-2xl font-bold leading-tight text-left">
          {currentQuestion.question || "Loading..."}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {currentQuestion.options.map((option, index) => {
          const optionNumber = index + 1;
          const isCorrect = optionNumber === currentQuestion.correctOption;
          const isSelected = optionNumber === selectedOption;

          let styling =
            "bg-white text-black hover:bg-[#FFEFD5] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

          if (isAnswered) {
            if (isSelected) {
              styling = isCorrect
                ? "bg-[#4ECDC4] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" // Correct Selection
                : "bg-[#FF6B6B] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"; // Wrong Selection
            } else if (isCorrect) {
              styling =
                "bg-[#4ECDC4] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"; // Show where the correct answer was
            } else {
              styling =
                "bg-gray-100 text-gray-400 border-gray-300 opacity-50 shadow-none"; // Muted others
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(optionNumber)}
              className={`py-4 px-4 rounded-xl border-4 border-black font-black text-lg text-left flex items-start gap-3 transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:pointer-events-none ${styling}`}
              disabled={isAnswered}
            >
              <span className="opacity-30">{index + 1}.</span>
              <span className="leading-tight">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuizWindow;
