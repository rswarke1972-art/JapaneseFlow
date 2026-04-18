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

fetch("data.json")
  .then(res => res.json())
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

        const span = document.createElement("span");

        span.innerText = item.word;
        span.className = "word";

        span.onclick = () => {
          showMeaning(item, span);

          document.querySelectorAll(".word").forEach(w => w.classList.remove("active"));
          span.classList.add("active");
        };

        container.appendChild(span);
      });
    }

  })
  .catch(err => {
    console.error("Error loading story:", err);
  });


// ===== POPUP =====
function showMeaning(item, element) {
  let popup = document.getElementById("popup");

  popup.innerHTML = `
    <div style="font-size:20px;">${item.word}</div>
    <div style="color:#38bdf8;">${item.romaji || ""}</div>
    <div>${item.meaning || ""}</div>
  `;

  popup.style.display = "block";

  // 🔥 Position near clicked word
  let rect = element.getBoundingClientRect();

  popup.style.top = (rect.top - 70) + "px";
  popup.style.left = (rect.left + rect.width / 2 - 50) + "px";
}

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

function renderTokens(tokens, lineDiv) {
  lineDiv.innerHTML = "";

  tokens.forEach(t => {
    const span = document.createElement("span");
    span.className = "word";
    span.innerText = t.word;

    span.onclick = (e) => {
      e.stopPropagation(); // 🔥 important
      showMeaning(t, span);

      document.querySelectorAll(".word").forEach(w => w.classList.remove("active"));
      span.classList.add("active");
    };

    lineDiv.appendChild(span);
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