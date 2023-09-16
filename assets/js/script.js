const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next");
const scoreElement = document.getElementById("score");
const difficultyButtons = document.querySelectorAll(".difficulty button");
const startGameButton = document.getElementById("start-game");

let currentDifficulty = "easy";
let currentQuestionIndex = 0;
let score = 0;
let questions = {};

let gameStarted = false;

// Function to fetch and load questions from the JSON file
function loadQuestions() {
    fetch("../questions.json")
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            questions = data;
            randomizeQuestions();
            setQuestion();
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

// Function To Set Current Question
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

// Function To Check The Correct Answer
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentDifficulty][currentQuestionIndex];
    if (selectedOption === currentQuestion.correctOption) {
        score++;
    }
    currentQuestionIndex++;
    scoreElement.textContent = `Score: ${score}`;
    setQuestion();
}

// Function To End Quiz
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
        if (gameStarted) {
            currentDifficulty = button.id;
            currentQuestionIndex = 0;
            score = 0;
            loadQuestions();
            nextButton.style.display = "block";
            scoreElement.textContent = `Score: ${score}`;
            document.getElementById("info").style.display = "none"; // Hide the instructions when difficulty changes
        } else {
            alert("Please start the game first by clicking 'Start Game'");
        }
    });
});

startGameButton.addEventListener("click", () => {
    startGame();
    document.getElementById("info").style.display = "none"; // Hide the instructions when the game starts
    nextButton.style.display = "block"; // Show the Next button when the game starts
});

// Function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        loadQuestions();
        startGameButton.style.display = "none";
    }
}
