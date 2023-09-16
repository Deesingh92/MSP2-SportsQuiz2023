const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next");
const scoreElement = document.getElementById("score");
const difficultyButtons = document.querySelectorAll(".difficulty button");

let currentDifficulty = "easy";
let currentQuestionIndex = 0;
let score = 0;

const questionsUrl = 'questions.json'

// Function to fetch and load questions from the JSON file
function loadQuestions() {
  fetch("../questions.json")
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
    .catch((error) => {
        console.error(error)
})
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
// Function To Check The Correnct Answer //
function checkAnswer(selectedOption) {
  const currentQuestion = questions[currentDifficulty][currentQuestionIndex];
  if (selectedOption === currentQuestion.correctOption) {
    score++;
  }
  currentQuestionIndex++;
  setQuestion();
}
// Function To End Quiz //
function endQuiz() {
  questionElement.textContent = "Quiz completed!";
  optionsElement.innerHTML = "";
  nextButton.style.display = "none";
  scoreElement.textContent = `Score: ${score}`;
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
    scoreElement.textContent = "Score: 0";
  });
});

// Start by loading questions when the page loads
loadQuestions();
