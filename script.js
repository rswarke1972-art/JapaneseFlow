// Stroke animation
function nextStroke() {
  if (current < strokes.length) {
    strokes[current].style.strokeDashoffset = 0;
    current++;
  }
}

let data = {};
let strokes = [];
let current = 0;

// Get selected character + script
let charObj = JSON.parse(localStorage.getItem("character"));
let script = localStorage.getItem("script") || "hiragana";

// Load data
fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    loadCharacter(charObj);
  });

function loadCharacter(charObj) {
  if (!charObj) return;

  // Display character
  document.getElementById("charDisplay").innerText = charObj.char;

  // 🔥 Universal label (instead of pinyin)
  document.getElementById("infoDisplay").innerText =
    charObj.romaji || charObj.meaning || "";

  // SVG container
  let svg = document.getElementById("character");
  svg.innerHTML = "";

  strokes = [];
  current = 0;

  // If strokes exist → animate
  if (charObj.strokes && charObj.strokes.length > 0) {
    charObj.strokes.forEach(pathData => {
      let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

      path.setAttribute("d", pathData);
      path.setAttribute("class", "stroke");

      svg.appendChild(path);
      strokes.push(path);
    });
  } else {
    // Fallback (important for Japanese MVP)
    svg.innerHTML = "<text x='50%' y='50%' text-anchor='middle' font-size='80'>" 
      + charObj.char + 
      "</text>";
  }
}

