
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next");
const scoreElement = document.getElementById("score");
const difficultyButtons = document.querySelectorAll(".difficulty button");
const startGameButton = document.getElementById("start-game");

// Audio elements for correct and incorrect answers with their sources
const correctAudio = new Audio("../assets/audio/correct.mp3");
const incorrectAudio = new Audio("../assets/audio/incorrect.mp3");

let currentDifficulty = "easy";
let currentQuestionIndex = 0;
let score = 0;
let questions = {};

let gameStarted = false;

let questionsAsked = 0; // Counter for the number of questions asked


const usedQuestions = {
    easy: [],
    medium: [],
    hard: [],
};

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
        if (questions.hasOwnProperty(difficulty)) { // Add this 'if' statement
            questions[difficulty] = shuffleArray(questions[difficulty]);
        }
    }
}

// Function to shuffle an array (Fisher-Yates shuffle) source: https://www.geeksforgeeks.org/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function To Set Current Question
function setQuestion() {
    const unusedQuestions = questions[currentDifficulty].filter((question) => !usedQuestions[currentDifficulty].includes(question));
    if (unusedQuestions.length === 0 || questionsAsked >= 10) {
        endQuiz();
        return;
    }

    // Select a random question from the unused questions
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const currentQuestion = unusedQuestions[randomIndex];
    usedQuestions[currentDifficulty].push(currentQuestion);

    // Check if all questions have been used
    if (usedQuestions[currentDifficulty].length === questions[currentDifficulty].length) {
        usedQuestions[currentDifficulty] = [];
    }

    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";
    currentQuestion.options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => checkAnswer(option, currentQuestion.correctOption));
        optionsElement.appendChild(button);
    });
    questionsAsked++; // Increment the questionsAsked counter
}

// Function To Check The Correct Answer
function checkAnswer(selectedOption, correctOption) {
    const buttons = optionsElement.querySelectorAll("button");

    buttons.forEach((button) => {
        button.disabled = true; // Disable all buttons to prevent further clicks
    });

    if (selectedOption === correctOption) {
        correctAudio.play();
        buttons.forEach((button) => {
            if (button.textContent === selectedOption) {
                button.style.backgroundColor = "green";
            }
        });
        score++;
    } else {
        incorrectAudio.currentTime = 0;
        incorrectAudio.play();
        buttons.forEach((button) => {
            if (button.textContent === selectedOption) {
                button.style.backgroundColor = "red";
            }
            if (button.textContent === correctOption) {
                button.style.backgroundColor = "green"; // Change the correct answer to green
            }
        });
    }

    currentQuestionIndex++;
    scoreElement.textContent = `Score: ${score}`;

    setTimeout(() => {
        setQuestion();
        buttons.forEach((button) => {
            button.style.backgroundColor = "";
            button.disabled = false;
        });
    }, 2000);
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
            questionsAsked = 0; // Reset the questionsAsked counter
            loadQuestions();
            nextButton.style.display = "block";
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
