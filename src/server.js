import axios from "axios";

export const getQuiz = async (retryCount = 3) => {
  let lastRequestTime = 0;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < retryCount; i++) {
    const now = Date.now();

    // Ensure at least 2 seconds gap between requests
    if (now - lastRequestTime < 2000) {
      console.warn("Too many requests! Waiting before retrying...");
      await delay(2000);
    }

    try {
      const response = await axios.get("https://opentdb.com/api.php?amount=10");
      lastRequestTime = Date.now(); // Update request time
      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && i < retryCount - 1) {
        console.warn(
          `Rate limited! Retrying in 2 seconds... (${i + 1}/${retryCount})`
        );
        await delay(2000); // Wait before retrying
      } else {
        console.error("Error fetching quiz:", error);
        return [];
      }
    }
  }
};

export const getGeminiQuiz = async (data) => {
  const { noOfQuestion, difficulty, topic } = data;
  try {
    const response = await axios.post("http://localhost:5000/quiz/questions", {
      noOfQuestion,
      difficulty,
      topic,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return [];
  }
};
