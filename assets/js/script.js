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
        setQuestion(questions[currentDifficulty][currentQuestionIndex]);
    });
