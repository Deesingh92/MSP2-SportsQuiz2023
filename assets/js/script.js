const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next");
const scoreElement = document.getElementById("score");
const difficultyButtons = document.querySelectorAll(".difficulty button");

let currentDifficulty = "easy";
let currentQuestionIndex = 0;
let score = 0;

const questions = {};

fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
        questions.easy = data.easy;
        questions.medium = data.medium;
        questions.hard = data.hard;
    });

function setQuestion() {
    const currentQuestion = questions[currentDifficulty][currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";
    currentQuestion.options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => checkAnswer(option));
        optionsElement.appendChild(button);
    });
}

