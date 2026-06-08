let storyLines = [];
let currentIndex = 0;
let touchStartX = 0;
let viewMode = "simple"; // or "original"

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e => {
  let touchEndX = e.changedTouches[0].screenX;

  if (touchEndX < touchStartX - 50) {
    nextLine(); // swipe left
  }

  if (touchEndX > touchStartX + 50) {
    prevLine(); // swipe right
  }
});

DataLoader.loadAll()
  .then(data => {

    const storyKey = localStorage.getItem("currentStory") || "default";
    const story = data.stories[storyKey];

    const container = document.getElementById("storyContainer");

    if (!story) {
      container.innerText = "Story not found ❌";
      return;
    }

    const controls = document.querySelector(".controls");

if (controls) {
  if (story.file) {
    controls.style.display = "flex";   // show for novel
  } else {
    controls.style.display = "none";   // hide for normal story
  }
}

const modeSwitch = document.querySelector(".mode-switch");

if (modeSwitch) {
  if (story.file) {
    modeSwitch.style.display = "flex";   // show for novel
  } else {
    modeSwitch.style.display = "none";   // hide for normal story
  }
}

    // 🆕 NEW: check if story has separate file
    if (story.file) {
      // load line-based novel
      fetch(story.file)
        .then(res => res.json())
        .then(storyData => {
          renderStory(storyData); // 👈 uses your new functions
        });

    } else {
      // 🔁 OLD SYSTEM (unchanged)
      story.content.forEach(item => {

        if (item.word === "。") {
          const br = document.createElement("br");
          container.appendChild(br);
          return;
        }

        const span = createTokenElement(item);
        container.appendChild(span);
      });
    }

    if (story.questions && story.questions.length > 0) {
      const quizBtn = document.getElementById("quizBtn");
      if (quizBtn) quizBtn.style.display = "block";
      window.currentStoryQuestions = story.questions;
    }

  })
  .catch(err => {
    console.error("Error loading story:", err);
  });

// ===== QUIZ LOGIC =====
let currentQuizIndex = 0;
let quizScore = 0;

window.startQuiz = function() {
  if (!window.currentStoryQuestions || window.currentStoryQuestions.length === 0) return;
  currentQuizIndex = 0;
  quizScore = 0;
  document.getElementById("quizOverlay").style.display = "block";
  document.getElementById("quizResult").innerText = "";
  renderQuizQuestion();
};

window.closeQuiz = function() {
  document.getElementById("quizOverlay").style.display = "none";
};

function renderQuizQuestion() {
  const content = document.getElementById("quizContent");
  content.innerHTML = "";
  
  if (currentQuizIndex >= window.currentStoryQuestions.length) {
    content.innerHTML = `<h3>Quiz Finished!</h3><p>Score: ${quizScore} / ${window.currentStoryQuestions.length}</p>`;
    return;
  }
  
  const q = window.currentStoryQuestions[currentQuizIndex];
  let html = `<p style="font-size:20px; margin-bottom:20px;">${q.question}</p>`;
  
  q.options.forEach((opt, idx) => {
    html += `<button class="story-btn" style="width:100%; max-width:100%; margin-bottom:10px; font-size:16px; padding:10px;" onclick="checkQuizAnswer(${idx}, ${q.answer})">${opt}</button>`;
  });
  
  content.innerHTML = html;
}

window.checkQuizAnswer = function(selected, correct) {
  const result = document.getElementById("quizResult");
  if (selected === correct) {
    quizScore++;
    result.innerText = "✅ Correct!";
    result.style.color = "#22c55e";
  } else {
    result.innerText = "❌ Incorrect.";
    result.style.color = "#ef4444";
  }
  
  setTimeout(() => {
    result.innerText = "";
    currentQuizIndex++;
    renderQuizQuestion();
  }, 1500);
};

// ===== POPUP =====
function showMeaning(item, element) {
  let popup = document.getElementById("popup");

  popup.innerHTML = `
    <div style="font-size:20px;">${item.word}</div>
    <div style="color:#38bdf8;">${item.romaji || ""}</div>
    <div>${item.meaning || ""}</div>
    <button class="action-btn" style="margin-top: 10px; font-size: 14px; padding: 5px 10px;" onclick="addWordToSRS('${item.word}')">➕ Add to SRS</button>
  `;

  popup.style.display = "block";

  // 🔥 Position near clicked word
  let rect = element.getBoundingClientRect();

  popup.style.top = (rect.top - 70) + "px";
  popup.style.left = (rect.left + rect.width / 2 - 50) + "px";
}

window.addWordToSRS = function(word) {
  if (typeof SRS !== 'undefined') {
    let item = SRS.getItem(word);
    if (item.stage === 0) {
      item.stage = 1;
      item.nextReview = Date.now(); // Due immediately for new words
      SRS.data.characters[word] = item;
      SRS.save();
      alert(`Added "${word}" to SRS reviews!`);
    } else {
      alert(`"${word}" is already in your SRS queue.`);
    }
  } else {
    alert("SRS system not found.");
  }
};

function renderStory(data) {
  storyLines = data.map(obj => {
    const key = Object.keys(obj)[0];
    return obj[key];
  });

  const storyKey = localStorage.getItem("currentStory");

let saved = null;

if (storyKey !== null) {
  saved = localStorage.getItem(`progress_${storyKey}`);
}

currentIndex = saved !== null ? parseInt(saved) : 0;

// safety
if (isNaN(currentIndex) || currentIndex >= storyLines.length) {
  currentIndex = 0;
}

  showLine();
}

function showLine() {
  const container = document.getElementById("storyContainer");
  container.innerHTML = "";

  const line = storyLines[currentIndex];

  if (!line) {
    container.innerText = "⚠️ No content";
    return;
  }

  const div = document.createElement("div");
  div.className = "line";
  div.dataset.mode = "simple";

  renderTokens(line[viewMode], div);

  div.onclick = () => toggleLine(div, line);

  container.appendChild(div);

  // ✅ SAVE with story-specific key
  const storyKey = localStorage.getItem("currentStory");

if (storyKey !== null) {
  localStorage.setItem(`progress_${storyKey}`, currentIndex);
}

  updateButtons();
}

function switchMode(mode) {
  viewMode = mode;
  showLine(); // re-render current line
}

function nextLine() {
  if (!storyLines.length) return;   // 🔥 important
  if (currentIndex < storyLines.length - 1) {
    currentIndex++;
    showLine();
  }
}

function prevLine() {
  if (!storyLines.length) return;   // 🔥 important
  if (currentIndex > 0) {
    currentIndex--;
    showLine();
  }
}

function updateButtons() {
  document.getElementById("prevBtn").disabled = currentIndex === 0;
  document.getElementById("nextBtn").disabled = currentIndex === storyLines.length - 1;
}

let furiganaMode = localStorage.getItem("furiganaMode") || "off";
const fModes = ["off", "on", "hover"];

window.toggleFurigana = function() {
  let idx = fModes.indexOf(furiganaMode);
  idx = (idx + 1) % fModes.length;
  furiganaMode = fModes[idx];
  localStorage.setItem("furiganaMode", furiganaMode);
  
  const btn = document.getElementById("furiganaBtn");
  if (btn) btn.innerText = `Furigana: ${furiganaMode.charAt(0).toUpperCase() + furiganaMode.slice(1)}`;
  
  // Re-render
  if (storyLines.length > 0) {
    showLine();
  } else {
    location.reload(); // Quick way to reload basic stories
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("furiganaBtn");
  if (btn) btn.innerText = `Furigana: ${furiganaMode.charAt(0).toUpperCase() + furiganaMode.slice(1)}`;
});

function createTokenElement(t) {
  const span = document.createElement("span");
  span.className = "word";
  
  if (furiganaMode !== "off" && t.romaji) {
    span.classList.add(`furigana-${furiganaMode}`);
    span.innerHTML = `<ruby>${t.word}<rt>${t.romaji}</rt></ruby>`;
  } else {
    span.innerText = t.word;
  }

  span.onclick = (e) => {
    e.stopPropagation();
    showMeaning(t, span);
    document.querySelectorAll(".word").forEach(w => w.classList.remove("active"));
    span.classList.add("active");
  };
  return span;
}

function renderTokens(tokens, lineDiv) {
  lineDiv.innerHTML = "";
  tokens.forEach(t => {
    lineDiv.appendChild(createTokenElement(t));
  });
}

function handleWordClick(el, word, romaji, meaning) {
  showMeaning({ word, romaji, meaning }, el);

  document.querySelectorAll(".word").forEach(w => w.classList.remove("active"));
  el.classList.add("active");
}

function toggleLine(div, line) {
  if (div.dataset.mode === "original") {
    renderTokens(line.simple, div);
    div.dataset.mode = "simple";
  } else {
    renderTokens(line.original, div);
    div.dataset.mode = "original";
  }
}


// ===== BACK BUTTON =====
function goBack() {
  window.history.back();
}