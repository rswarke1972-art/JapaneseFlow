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

  window.startWritingQuiz = function() {
    writer.quiz({
      onMistake: function(strokeData) {
        console.log('Oh no! you made a mistake on stroke ' + strokeData.strokeNum);
        console.log("Mistakes so far on this stroke: " + strokeData.mistakesOnStroke);
        console.log("Total mistakes: " + strokeData.totalMistakes);
      },
      onComplete: function(summaryData) {
        alert('You did it! You drew the character correctly.');
        // Optionally bump SRS rating if they pass the quiz!
      }
    });
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

// ===== AUDIO & SRS (V2.5) =====
window.playAudio = function() {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(charObj.char);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Text-to-speech not supported in this browser.");
  }
};

window.addToSRS = function() {
  if (typeof SRS !== 'undefined') {
    let item = SRS.getItem(charObj.char);
    if (item.stage === 0) {
      // Add as Stage 1
      item.stage = 1;
      item.nextReview = Date.now(); // Due immediately
      item.script = script;
      SRS.data.characters[charObj.char] = item;
      SRS.save();
      document.getElementById('srsAddBtn').innerText = "✅ Added to Reviews";
      document.getElementById('srsAddBtn').disabled = true;
    } else {
      alert("Already in review queue!");
    }
  }
};

// Check if already in SRS
document.addEventListener('DOMContentLoaded', () => {
  if (typeof SRS !== 'undefined') {
    let item = SRS.getItem(charObj.char);
    if (item.stage > 0) {
      const btn = document.getElementById('srsAddBtn');
      if (btn) {
        btn.innerText = "✅ In Reviews";
        btn.disabled = true;
      }
    }
  }
});