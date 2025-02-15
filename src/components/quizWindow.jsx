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
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center flex flex-col space-y-6">
      <div className="flex justify-around items-center bg-gray-100 p-4 rounded-lg shadow-inner">
        <h3 className="text-2xl font-semibold">{category}</h3>
        <div
          className={`text-3xl font-extrabold flex items-center justify-center w-16 h-16 bg-cover bg-center bg-no-repeat ${
            timer <= time * 0.75 ? "text-red-500" : "text-green-500"
          }`}
          style={{ backgroundImage: "url(/Assets/stopwatch.png)" }}
          aria-label={`Time left: ${timer} seconds`}
        >
          <span className="px-2 rounded">{timer}</span>
        </div>
      </div>

      <h4 className="text-2xl font-extrabold text-gray-800 mt-4">
        Question {questionNumber + 1} of {noOfQuestion}
      </h4>

      <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-300">
        <h3 className="text-xl font-semibold text-blue-800">Question</h3>
        <p className="mt-2 text-lg font-medium text-gray-900">
          {currentQuestion.question || "Loading..."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          const optionNumber = index + 1;
          const isCorrect = optionNumber === currentQuestion.correctOption;
          const isSelected = optionNumber === selectedOption;

          let bgColor = "bg-gray-200 hover:bg-gray-300";
          if (isAnswered) {
            if (isSelected) {
              bgColor = isCorrect ? "bg-green-500" : "bg-red-500";
            } else if (isCorrect) {
              bgColor = "bg-green-500"; // Show correct option
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(optionNumber)}
              className={`py-3 px-4 rounded-lg shadow-md ${bgColor}`}
              disabled={isAnswered} // Disable after selecting an option
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default QuizWindow;
