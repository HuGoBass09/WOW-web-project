const data = [
    { word: "python", hint: "A popular programming language." },
    { word: "chess", hint: "A strategic board game played by two players." },
    { word: "rainbow", hint: "A multicolored arc seen after rain." },
    { word: "airplane", hint: "A vehicle used for air travel." },
    { word: "butterfly", hint: "An insect with colorful wings." },
    { word: "volcano", hint: "A mountain that can erupt with lava." },
    { word: "piano", hint: "A musical instrument with black and white keys." },
    { word: "galaxy", hint: "A system of stars, planets, and cosmic dust." },
    { word: "rocket", hint: "A vehicle used to explore outer space." },
    { word: "jungle", hint: "A dense forest with diverse wildlife." },
    { word: "penguin", hint: "A flightless bird found in Antarctica." },
    { word: "pyramid", hint: "A triangular structure built in ancient Egypt." },
    { word: "kangaroo", hint: "A hopping animal native to Australia." },
    { word: "island", hint: "A piece of land surrounded by water." },
    { word: "castle", hint: "A large fortified building from the medieval period." }
];

const startBtn = document.querySelector(".start-btn");
const alphabetButtons = document.querySelectorAll(".alphabet-container button");
const timeElement = document.querySelector(".time");
const timeContainer = document.querySelector(".time");
const scoreElement = document.querySelector(".score span");
const inputField = document.querySelector(".inputs");
const Hint = document.querySelector(".hint");
const nextWordBtn = document.querySelector(".next-word");

let currentWord = "";
let score = 0;
let timer;
let gameStarted = false;
let incorrectLetters = [];
let correctLetters = [];
let clickedLetters = new Set();

function initiateGame() {
    if (!gameStarted) {
        gameStarted = true;
        incorrectLetters = [];
        correctLetters = [];
        clickedLetters.clear();
        startBtn.disabled = true;
        beginTimer(30);
        timeContainer.style.backgroundColor = "green";
        applyButtonEffects();
        selectRandomWord();
        score = 0;
        refreshScore();
    }
}

function beginTimer(seconds) {
    let time = seconds;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeElement.textContent = "Time: " + time;
        time--;
        if (time < 0) {
            terminateGame();
        }
    }, 1000);
}

function applyButtonEffects() {
    alphabetButtons.forEach(button => {
        button.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.6), 0 0 10px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2)";
    });
}

function refreshScore() {
    scoreElement.textContent = "Score: " + score;
}

function selectRandomWord() {
    if (gameStarted) {
        if (data.length === 0) {
            terminateGame();
            return;
        }
        const randomIndex = Math.floor(Math.random() * data.length);
        currentWord = data[randomIndex].word;
        const wordLength = currentWord.length;
        Hint.textContent = "Hint: " + data[randomIndex].hint;
        data.splice(randomIndex, 1);
        let html = "";
        inputField.innerHTML = html;
        for (let i = 0; i < wordLength; i++) {
            html += '<input type="text" class="user-input-game-time" disabled>';
        }
        inputField.innerHTML = html;
        alphabetButtons.forEach(button => {
            button.style.backgroundColor = "";
        });
        clickedLetters.clear();
    }
}

function terminateGame() {
    if (timer) clearInterval(timer);
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "#fff";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    popup.style.borderRadius = "10px";
    popup.style.textAlign = "center";
    popup.style.zIndex = "1000";

    const scoreMessage = document.createElement("p");
    scoreMessage.textContent = `Game Over! Your final score is ${score}.`;
    scoreMessage.style.fontSize = "18px";
    scoreMessage.style.marginBottom = "20px";
    popup.appendChild(scoreMessage);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.style.padding = "10px 20px";
    restartButton.style.fontSize = "16px";
    restartButton.style.backgroundColor = "#4CAF50";
    restartButton.style.color = "#fff";
    restartButton.style.border = "none";
    restartButton.style.borderRadius = "5px";
    restartButton.style.cursor = "pointer";
    restartButton.addEventListener("click", () => {
        window.location.reload();
    });
    popup.appendChild(restartButton);
    document.body.appendChild(popup);

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";
    document.body.appendChild(overlay);
}

function processUserInput(letter, button) {
    if (gameStarted && !clickedLetters.has(letter)) {
        clickedLetters.add(letter);
        if (currentWord.includes(letter)) {
            let instances = 0;
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i] === letter) {
                    correctLetters.push(letter);
                    inputField.querySelectorAll('.user-input-game-time')[i].value = letter;
                    instances++;
                }
            }
            score += instances * 10;
            button.style.backgroundColor = "green";
        } else {
            incorrectLetters.push(letter);
            score -= 10;
            if (score < 0) score = 0;
            button.style.backgroundColor = "red";
        }
        refreshScore();
        if (correctLetters.length === currentWord.length) {
            setTimeout(() => {
                beginTimer(30);
                selectRandomWord();
                correctLetters = [];
                incorrectLetters = [];
            }, 500);
        }
    }
}

startBtn.addEventListener("click", initiateGame);
nextWordBtn.addEventListener("click", selectRandomWord);

alphabetButtons.forEach(button => {
    button.addEventListener("click", () => {
        processUserInput(button.innerText, button);
    });
});
