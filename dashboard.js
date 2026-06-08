// Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
  if (typeof SRS !== 'undefined') {
    updateDashboard();
  }
});

async function updateDashboard() {
  const stats = SRS.getStats();
  const reviewsDue = SRS.getReviewsDue();
  
  // Update stats
  document.getElementById('streakStat').innerText = stats.streak;
  document.getElementById('goalStat').innerText = `${stats.reviewsCompletedToday}/${stats.dailyGoal}`;
  document.getElementById('levelStat').innerText = stats.level;
  document.getElementById('xpStat').innerText = stats.xp;
  document.getElementById('achieveStat').innerText = stats.achievements.length;
  
  // Update review button
  const reviewBtn = document.getElementById('reviewBtn');
  if (reviewsDue.length > 0) {
    reviewBtn.innerText = `Reviews Due (${reviewsDue.length})`;
    reviewBtn.disabled = false;
    reviewBtn.style.opacity = '1';
  } else {
    reviewBtn.innerText = `All Caught Up! 🎉`;
    reviewBtn.disabled = true;
    reviewBtn.style.opacity = '0.7';
    reviewBtn.style.background = '#22c55e';
  }

  // Progress Tracking
  let learnedCount = 0;
  let masteredCount = 0;
  let totalSuccesses = 0;
  let totalFailures = 0;
  let n5Learned = 0;

  for (const char in SRS.data.characters) {
    const item = SRS.data.characters[char];
    if (item.stage > 0) learnedCount++;
    if (item.stage === 8) masteredCount++;
    totalSuccesses += item.successes || 0;
    totalFailures += item.failures || 0;
  }

  document.getElementById('learnedStat').innerText = learnedCount;
  document.getElementById('masteredStat').innerText = masteredCount;

  let accuracy = 0;
  if (totalSuccesses + totalFailures > 0) {
    accuracy = Math.round((totalSuccesses / (totalSuccesses + totalFailures)) * 100);
  }
  document.getElementById('accuracyStat').innerText = `${accuracy}%`;

  // Calculate JLPT N5 Progress and Smart Recommendation
  if (typeof DataLoader !== 'undefined') {
    try {
      const data = await DataLoader.loadAll();
      let hiraCount = 0, kataCount = 0;
      let totalHira = 0, totalKata = 0;
      
      // Hiragana check
      for (const level in data.hiragana) {
        totalHira += data.hiragana[level].length;
        data.hiragana[level].forEach(k => { if (SRS.data.characters[k.char] && SRS.data.characters[k.char].stage > 0) hiraCount++; });
      }
      
      // Katakana check
      for (const level in data.katakana) {
        totalKata += data.katakana[level].length;
        data.katakana[level].forEach(k => { if (SRS.data.characters[k.char] && SRS.data.characters[k.char].stage > 0) kataCount++; });
      }
      
      if (data && data.kanji && data.kanji.n5) {
        const totalN5 = data.kanji.n5.length;
        data.kanji.n5.forEach(k => {
          if (SRS.data.characters[k.char] && SRS.data.characters[k.char].stage > 0) {
            n5Learned++;
          }
        });
        const n5Progress = Math.round((n5Learned / totalN5) * 100);
        document.getElementById('jlptStat').innerText = `${n5Progress}%`;
      }
      
      // Smart Recommendation Logic
      const recBtn = document.getElementById('recommendBtn');
      if (hiraCount < totalHira * 0.9) {
        recBtn.innerText = `💡 Recommended: Finish Hiragana (${Math.round(hiraCount/totalHira*100)}%)`;
        window.goToRecommended = () => openScript('hiragana');
      } else if (kataCount < totalKata * 0.9) {
        recBtn.innerText = `💡 Recommended: Learn Katakana (${Math.round(kataCount/totalKata*100)}%)`;
        window.goToRecommended = () => openScript('katakana');
      } else if (n5Learned < 100) {
        recBtn.innerText = `💡 Recommended: Start Kanji N5`;
        window.goToRecommended = () => { localStorage.setItem("level", "n5"); window.location.href = "characters.html?script=kanji"; };
      } else {
        recBtn.innerText = `💡 Recommended: Read a Story`;
        window.goToRecommended = () => goToStories();
      }

    } catch (e) {
      console.error(e);
    }
  }
}
