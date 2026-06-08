let reviewQueue = [];
let currentIndex = 0;
let currentCharData = null;
let answered = false;

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof SRS === 'undefined') return;
  
  reviewQueue = SRS.getReviewsDue();
  
  if (reviewQueue.length === 0) {
    showFinished();
  } else {
    await loadNextReview();
  }
  
  document.getElementById('romajiInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      checkTyping();
    }
  });
});

async function loadNextReview() {
  if (currentIndex >= reviewQueue.length) {
    showFinished();
    return;
  }

  answered = false;
  const char = reviewQueue[currentIndex];
  currentCharData = await DataLoader.findCharacter(char);
  
  document.getElementById('reviewCounter').innerText = `Reviews Left: ${reviewQueue.length - currentIndex}`;
  document.getElementById('charDisplay').innerText = char;
  
  // Reset UI
  document.getElementById('typeArea').style.display = 'block';
  document.getElementById('romajiInput').value = '';
  document.getElementById('romajiInput').focus();
  document.getElementById('romajiInput').disabled = false;
  
  document.getElementById('answerData').style.display = 'none';
  document.getElementById('ratingBtns').style.display = 'none';
  document.getElementById('showAnswerBtn').style.display = 'none';
  
  // Pronounce character automatically if Web Speech API is present
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  }
}

function checkTyping() {
  if (answered) return;
  const input = document.getElementById('romajiInput').value.trim().toLowerCase();
  const correct = currentCharData.romaji.toLowerCase();
  
  document.getElementById('romajiInput').disabled = true;
  
  if (input === correct) {
    document.getElementById('romajiInput').style.backgroundColor = '#16a34a'; // Green
  } else {
    document.getElementById('romajiInput').style.backgroundColor = '#ef4444'; // Red
  }
  
  showAnswer();
}

function showAnswer() {
  answered = true;
  document.getElementById('typeArea').style.display = 'none';
  document.getElementById('showAnswerBtn').style.display = 'none';
  
  // Populate answer data
  document.getElementById('romajiDisplay').innerText = currentCharData.romaji;
  document.getElementById('meaningDisplay').innerText = currentCharData.meaning;
  
  document.getElementById('answerData').style.display = 'block';
  document.getElementById('ratingBtns').style.display = 'flex';
}

function rate(rating) {
  const char = reviewQueue[currentIndex];
  SRS.processReview(char, rating, currentCharData.script || 'kanji');
  
  currentIndex++;
  loadNextReview();
}

function showFinished() {
  document.getElementById('card').style.display = 'none';
  document.getElementById('reviewCounter').style.display = 'none';
  document.getElementById('finishedMsg').style.display = 'block';
}