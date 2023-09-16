const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("start");
const scoreElement = document.getElementById("score");
const difficultyButtons = document.querySelectorAll(".difficulty button");

let currentDifficulty = "easy";
let currentQuestionIndex = 0;
let score = 0;
let questions = {};

// Function to fetch and load questions from the JSON file
function loadQuestions() {
  fetch("../questions.json")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      questions = data;
      randomizeQuestions();
      setQuestion(); // Call setQuestion after loading and randomizing questions
    })
    .catch((error) => {
      console.error(error);
    });
}

// Function to randomize questions within each difficulty level
function randomizeQuestions() {
  for (const difficulty in questions) {
    questions[difficulty] = shuffleArray(questions[difficulty]);
  }
}

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function To Set Current Question //
function setQuestion() {
  const currentQuestion = questions[currentDifficulty][currentQuestionIndex];
  if (!currentQuestion) {
    endQuiz();
    return;
  }
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(option));
    optionsElement.appendChild(button);
  });
}

// Function To Check The Correct Answer //
function checkAnswer(selectedOption) {
  const currentQuestion = questions[currentDifficulty][currentQuestionIndex];
  if (selectedOption === currentQuestion.correctOption) {
    score++; // Increment the score for correct answers
  }
  currentQuestionIndex++;
  scoreElement.textContent = `Score: ${score}`; // Update the displayed score
  setQuestion();
}

// Function To End Quiz //
function endQuiz() {
  questionElement.textContent = "Quiz completed!";
  optionsElement.innerHTML = "";
  nextButton.style.display = "none";
  scoreElement.textContent = `Final Score: ${score}`;
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setQuestion();
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentDifficulty = button.id;
    currentQuestionIndex = 0;
    score = 0;
    loadQuestions(); // Load questions when difficulty level changes
    nextButton.style.display = "block";
    scoreElement.textContent = `Score: ${score}`;
  });
});

// Start by loading questions when the page loads
loadQuestions();
