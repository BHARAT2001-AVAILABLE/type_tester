const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This is a longer sentence to increase the paragraph size for better practice.",
    "A journey of a thousand miles begins with a single step. Keep practicing and you will get better at typing fast and accurately.",
    "The more you practice, the better you become at typing without looking at the keyboard. Focus on typing the right characters quickly.",
    "Improving your typing speed takes effort. Start small and challenge yourself to achieve higher typing speeds every time.",
    "Coding is fun, and the best way to improve your typing skills is to practice daily by typing more paragraphs like this one."
];

let time;
let timer;
let mistakes = 0;
let isStarted = false;
let randomParagraph;
let totalCharsTyped = 0;
let lastCorrectIndex = 0;
let previousMistake = -1;  // New variable to prevent over-counting mistakes

const timeLeftElement = document.getElementById('time-left');
const mistakesElement = document.getElementById('mistakes');
const wpmElement = document.getElementById('wpm');
const cpmElement = document.getElementById('cpm');
const inputArea = document.getElementById('input-area');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const randomParagraphElement = document.getElementById('random-paragraph');
const progressTrackerElement = document.getElementById('progress-tracker');
const timeDurationInput = document.getElementById('time-duration');
const topScoresList = document.getElementById('top-scores');
const themeToggle = document.getElementById('theme');
const keyboardContainer = document.getElementById('keyboard');

// 14-inch laptop keyboard layout
const keyboardLayout = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
    "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\",
    "Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter",
    "Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift",
    "Space"
];

// Function to create the keyboard
function createKeyboard() {
    keyboardLayout.forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.textContent = key;
        keyElement.classList.add('key');
        keyboardContainer.appendChild(keyElement);
    });
}

// Call the function to generate the keyboard
createKeyboard();

function startGame() {
    if (isStarted) return;
    isStarted = true;
    randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    randomParagraphElement.textContent = randomParagraph;
    inputArea.disabled = false;
    inputArea.value = '';
    inputArea.focus();
    
    time = parseInt(timeDurationInput.value);
    mistakes = 0;
    totalCharsTyped = 0;
    lastCorrectIndex = 0;
    previousMistake = -1;  // Reset previous mistake

    timeLeftElement.textContent = time;
    mistakesElement.textContent = mistakes;
    wpmElement.textContent = 0;
    cpmElement.textContent = 0;
    progressTrackerElement.textContent = `Progress: 0 / ${randomParagraph.length} characters`;

    timer = setInterval(updateTime, 1000);
    resetBtn.disabled = false;
    startBtn.disabled = true;
}

function resetGame() {
    clearInterval(timer);
    isStarted = false;
    inputArea.value = '';
    inputArea.disabled = true;
    randomParagraphElement.textContent = 'Press Start to get a random paragraph...';
    timeLeftElement.textContent = timeDurationInput.value;
    mistakesElement.textContent = 0;
    wpmElement.textContent = 0;
    cpmElement.textContent = 0;
    progressTrackerElement.textContent = `Progress: 0 / 0 characters`;
    deactivateAllKeys();
    startBtn.disabled = false;
    resetBtn.disabled = true;
}

function updateTime() {
    if (time > 0) {
        time--;
        timeLeftElement.textContent = time;
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timer);
    inputArea.disabled = true;
    let wpm = calculateWPM();
    let cpm = calculateCPM();
    saveResults(wpm, cpm);
    updateLeaderboard(wpm);
    startBtn.disabled = false;
    resetBtn.disabled = true;
}

function calculateWPM() {
    let wordsTyped = inputArea.value.split(' ').length;
    let wpm = Math.round((wordsTyped / (parseInt(timeDurationInput.value) - time)) * 60);
    wpmElement.textContent = wpm;
    return wpm;
}

function calculateCPM() {
    let cpm = Math.round((totalCharsTyped / (parseInt(timeDurationInput.value) - time)) * 60);
    cpmElement.textContent = cpm;
    return cpm;
}

function saveResults(wpm, cpm) {
    let typingData = {
        wpm: wpm,
        cpm: cpm,
        date: new Date().toLocaleString()
    };
    let previousResults = JSON.parse(localStorage.getItem('typingResults')) || [];
    previousResults.push(typingData);
    localStorage.setItem('typingResults', JSON.stringify(previousResults));
}

function updateLeaderboard(wpm) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push(wpm);
    leaderboard = leaderboard.sort((a, b) => b - a).slice(0, 5); // Top 5 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    topScoresList.innerHTML = '';
    leaderboard.forEach((score, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `#${index + 1}: ${score} WPM`;
        topScoresList.appendChild(listItem);
    });
}

// Handle input and check correctness
inputArea.addEventListener('input', () => {
    totalCharsTyped++;
    let currentInput = inputArea.value;
    let correctTextSoFar = randomParagraph.substring(0, currentInput.length);

    if (currentInput === correctTextSoFar) {
        inputArea.style.borderColor = 'green';
        lastCorrectIndex = currentInput.length;
    } else {
        inputArea.style.borderColor = 'red';
        if (currentInput.length > lastCorrectIndex && currentInput.length - 1 !== previousMistake) {
            mistakes++;
            mistakesElement.textContent = mistakes;
            previousMistake = currentInput.length - 1;  // Track the incorrect character index
        }
    }

    // Update progress tracker
    progressTrackerElement.textContent = `Progress: ${currentInput.length} / ${randomParagraph.length} characters`;

    // Highlight the active key on the keyboard
    deactivateAllKeys();
    let currentChar = currentInput.charAt(currentInput.length - 1).toUpperCase();
    let keyElement = Array.from(document.querySelectorAll('.key')).find(key => key.textContent === currentChar);
    if (keyElement) {
        keyElement.classList.add('active');
    }
});

// Deactivate all key highlights
function deactivateAllKeys() {
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('active');
    });
}

// Dark mode toggle
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
