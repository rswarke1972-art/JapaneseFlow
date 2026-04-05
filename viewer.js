// ===== GET DATA =====
let charObj = JSON.parse(localStorage.getItem("character")) || {};
let script = localStorage.getItem("script") || "hiragana";

// ===== DISPLAY TEXT =====
document.getElementById("charDisplay").innerText = charObj.char || "";

document.getElementById("infoDisplay").innerText =
  charObj.romaji || charObj.pinyin || "";

document.getElementById("meaning").innerText = charObj.meaning || "";
document.getElementById("example").innerText = charObj.example || "";
document.getElementById("exampleSub").innerText =
  charObj.example_romaji || "";
document.getElementById("explanation").innerText =
  charObj.explanation || "";

// ===== MUSIC =====
let music = document.getElementById("bgMusic");
music.volume = 0.2;

function toggleMusic() {
  if (music.paused) music.play();
  else music.pause();
}

// ===== CHARACTER DISPLAY =====
let container = document.getElementById("character");

// ================================
// 🔴 KANJI / CHINESE MODE
// ================================
if (script === "kanji" || script === "chinese") {

  container.innerHTML = `<div id="hanzi-target"></div>`;

  let writer = HanziWriter.create('hanzi-target', charObj.char, {
    width: 200,
    height: 200,
    padding: 10,
    showOutline: true,
    strokeAnimationSpeed: 1,
    delayBetweenStrokes: 300
  });

  let currentStroke = 0;

  // ▶ Play full animation
  window.play = function () {
    currentStroke = 0;
    writer.animateCharacter();
  };

  // 🔄 Reset
  window.reset = function () {
    currentStroke = 0;
    writer.hideCharacter();
  };

  // ➡ Next stroke (FIXED)
  window.nextStroke = function () {
    writer.animateStroke(currentStroke);
    currentStroke++;
  };

} 

// ================================
// 🟢 KANA MODE (HIRAGANA / KATAKANA)
// ================================
else {

  container.innerHTML = `
    <div style="
      font-size: 100px;
      display:flex;
      align-items:center;
      justify-content:center;
      height:100%;
      color: white;
    ">
      ${charObj.char}
    </div>
  `;

  // Disable stroke buttons
  window.play = function () {
    alert("Stroke animation available for Kanji only");
  };

  window.reset = function () {};

  window.nextStroke = function () {};
}

// ===== BACK =====
function goBack() {
  window.history.back();
}