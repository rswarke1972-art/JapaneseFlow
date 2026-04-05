let data = {};

// ===== GET SCRIPT FROM URL =====
const params = new URLSearchParams(window.location.search);
let script = params.get("script") || "hiragana";

// ===== FIX LEVEL LOGIC =====
let level = localStorage.getItem("level");

// 🔥 Auto-set correct level based on script
if (script === "kanji") {
  if (!level || !level.startsWith("n")) {
    level = "n5";
    localStorage.setItem("level", "n5");
  }
} else {
  if (!level || level.startsWith("n")) {
    level = "basic";
    localStorage.setItem("level", "basic");
  }
}

// ===== SAVE SCROLL POSITION =====
window.addEventListener("scroll", () => {
  localStorage.setItem("scrollPosition", window.scrollY);
});

// ===== LOAD DATA =====
fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;

    console.log("Loaded:", script, level, data);

    loadCharacters();
  })
  .catch(err => {
    console.error("Failed to load data.json", err);
  });

// ===== LOAD CHARACTERS =====
function loadCharacters() {
  let listDiv = document.getElementById("characterList");
  listDiv.innerHTML = "";

  let characters = data[script]?.[level];

  if (!characters || characters.length === 0) {
    console.error("No data found for:", script, level);
    listDiv.innerHTML = `<p>No characters found for ${script} (${level})</p>`;
    return;
  }

  characters.forEach((charObj, index) => {
    let btn = document.createElement("button");
    btn.className = "char-btn";
    btn.innerText = charObj.char;

    btn.onclick = () => {
      localStorage.setItem("character", JSON.stringify(charObj));
      localStorage.setItem("script", script);

      // 🔥 SAVE LAST CLICKED INDEX
      localStorage.setItem("lastIndex", index);

      // OPTIONAL: mark as visited
      localStorage.setItem("visited_" + charObj.char, "true");

      window.location.href = "viewer.html";
    };

    // OPTIONAL: highlight visited characters
    if (localStorage.getItem("visited_" + charObj.char)) {
      btn.style.background = "#4CAF50";
      btn.style.color = "white";
    }

    listDiv.appendChild(btn);
  });

  // ===== RESTORE POSITION =====
  restoreScrollPosition();
}

// ===== RESTORE SCROLL / FOCUS =====
function restoreScrollPosition() {
  setTimeout(() => {
    const lastIndex = localStorage.getItem("lastIndex");

    if (lastIndex !== null) {
      const buttons = document.querySelectorAll(".char-btn");
      const target = buttons[lastIndex];

      if (target) {
        target.scrollIntoView({
          behavior: "auto", // change to "smooth" if you want animation
          block: "center"
        });
        return;
      }
    }

    // fallback: scroll position
    const scrollPosition = localStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
    }
  }, 100);
}

// ===== BACK BUTTON =====
function goBack() {
  window.history.back();
}