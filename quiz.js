let allCharacters = [];
let currentQuestion;
let correctAnswer;
let score = 0;

// Get script + level
const params = new URLSearchParams(window.location.search);
const script = params.get("script") || "hiragana";
const level = localStorage.getItem("level") || "basic";

// Load data
async function loadData() {
  try {
    let res = await fetch("data.json");
    let data = await res.json();

    // 🔥 ALWAYS LOAD ALL CHARACTERS
    allCharacters = getAllCharacters(data);

    if (!allCharacters || allCharacters.length === 0) {
      console.error("No characters loaded");
      return;
    }

    console.log("Loaded characters:", allCharacters.length);

    nextQuestion();

  } catch (err) {
    console.error("Error loading data:", err);
  }
}

// Generate question
function nextQuestion() {
  document.getElementById("result").innerText = "";
  document.getElementById("nextBtn").style.display = "none";

  currentQuestion = allCharacters[Math.floor(Math.random() * allCharacters.length)];

  // For Japanese: use romaji
  correctAnswer = currentQuestion.romaji;

  document.getElementById("questionChar").innerText = currentQuestion.char;

  let options = [correctAnswer];

  while (options.length < 4) {
    let random = allCharacters[Math.floor(Math.random() * allCharacters.length)].romaji;
    if (!options.includes(random)) {
      options.push(random);
    }
  }

  // Shuffle
  options.sort(() => Math.random() - 0.5);

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  options.forEach(option => {
    let btn = document.createElement("button");
    btn.innerText = option;

    btn.onclick = () => checkAnswer(option);

    optionsDiv.appendChild(btn);
  });
}

// Check answer
function checkAnswer(selected) {
  let result = document.getElementById("result");

  if (selected === correctAnswer) {
    score++;
    result.innerText = "✅ Correct!";
    result.style.color = "lightgreen";
  } else {
    score--;
    result.innerText = `❌ Wrong! Correct: ${correctAnswer}`;
    result.style.color = "red";
  }

  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("nextBtn").style.display = "block";
}

function getAllCharacters(data) {
  let all = [];

  // hiragana
  Object.values(data.hiragana).forEach(level => {
    all = all.concat(level);
  });

  // katakana
  Object.values(data.katakana).forEach(level => {
    all = all.concat(level);
  });

  // kanji
  Object.values(data.kanji).forEach(level => {
    all = all.concat(level);
  });

  return all;
}

// Back button
function goBack() {
  window.history.back();
}

loadData();