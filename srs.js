// Spaced Repetition System Engine
const SRS = {
  data: {
    characters: {},
    stats: {
      streak: 0,
      lastStudyDate: null,
      reviewsCompletedToday: 0,
      dailyGoal: 20,
      xp: 0,
      level: 1,
      achievements: []
    }
  },

  // SM-2 Simplified Intervals (in hours)
  intervals: [
    4,       // Stage 1: 4 hours
    12,      // Stage 2: 12 hours
    24,      // Stage 3: 1 day
    72,      // Stage 4: 3 days
    168,     // Stage 5: 1 week
    336,     // Stage 6: 2 weeks
    720,     // Stage 7: 1 month
    2880     // Stage 8: 4 months (Mastered)
  ],

  init() {
    const saved = localStorage.getItem('jf_srs_data');
    if (saved) {
      this.data = JSON.parse(saved);
      // Migrate old data
      if (this.data.stats.xp === undefined) this.data.stats.xp = 0;
      if (this.data.stats.level === undefined) this.data.stats.level = 1;
      if (this.data.stats.achievements === undefined) this.data.stats.achievements = [];
      this.checkStreak();
    } else {
      this.save();
    }
  },

  save() {
    localStorage.setItem('jf_srs_data', JSON.stringify(this.data));
  },

  addXP(amount) {
    this.data.stats.xp += amount;
    const newLevel = Math.floor(this.data.stats.xp / 100) + 1;
    if (newLevel > this.data.stats.level) {
      this.data.stats.level = newLevel;
      // Could trigger UI notification here
      alert(`🎉 Level Up! You are now Level ${newLevel}!`);
    }
    this.checkAchievements();
    this.save();
  },

  grantAchievement(id) {
    if (!this.data.stats.achievements.includes(id)) {
      this.data.stats.achievements.push(id);
      this.addXP(50); // Bonus XP for achievement
      alert(`🏆 Achievement Unlocked: ${id}`);
    }
  },

  checkAchievements() {
    let learnedCount = 0;
    let masteredCount = 0;
    let reviewCount = 0;
    for (const char in this.data.characters) {
      const item = this.data.characters[char];
      if (item.stage > 0) learnedCount++;
      if (item.stage === 8) masteredCount++;
      reviewCount += item.successes + item.failures;
    }

    if (reviewCount > 0) this.grantAchievement("First Review");
    if (reviewCount >= 100) this.grantAchievement("100 Reviews");
    if (learnedCount >= 50) this.grantAchievement("50 Characters Learned");
    if (masteredCount >= 10) this.grantAchievement("10 Characters Mastered");
    
    if (this.data.stats.streak >= 3) this.grantAchievement("3 Day Streak");
    if (this.data.stats.streak >= 7) this.grantAchievement("7 Day Streak");
  },

  checkStreak() {
    const today = new Date().toDateString();
    if (this.data.stats.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (this.data.stats.lastStudyDate !== yesterday.toDateString()) {
        // Streak broken
        this.data.stats.streak = 0;
      }
      this.data.stats.reviewsCompletedToday = 0;
      this.save();
    }
  },

  updateStreak() {
    const today = new Date().toDateString();
    if (this.data.stats.lastStudyDate !== today) {
      this.data.stats.streak += 1;
      this.data.stats.lastStudyDate = today;
      this.addXP(10); // Daily login XP
    }
    this.data.stats.reviewsCompletedToday += 1;
    if (this.data.stats.reviewsCompletedToday === this.data.stats.dailyGoal) {
      this.addXP(20); // Daily goal reached XP
      this.grantAchievement("Daily Goal Met");
    }
    this.save();
  },

  getItem(char) {
    return this.data.characters[char] || {
      stage: 0,
      nextReview: 0,
      successes: 0,
      failures: 0
    };
  },

  processReview(char, rating, scriptType) {
    let item = this.getItem(char);
    
    // Rating: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
    if (rating === 0) { // Again (Fail)
      item.stage = Math.max(1, item.stage - 2); 
      item.failures += 1;
      // Review again in 5 minutes
      item.nextReview = Date.now() + (5 * 60 * 1000); 
    } else {
      item.successes += 1;
      if (rating === 1) { // Hard
        item.stage = Math.max(1, item.stage);
        this.addXP(2);
      } else if (rating === 2) { // Good
        item.stage += 1;
        this.addXP(5);
      } else if (rating === 3) { // Easy
        item.stage += 2;
        this.addXP(10);
      }
      
      // Cap stage
      item.stage = Math.min(item.stage, this.intervals.length);
      
      const hours = this.intervals[item.stage - 1];
      item.nextReview = Date.now() + (hours * 60 * 60 * 1000);
      
      // Update streak/stats on success
      this.updateStreak();
    }

    item.script = scriptType; // track what script it belongs to
    this.data.characters[char] = item;
    this.save();
  },

  getReviewsDue() {
    const now = Date.now();
    let due = [];
    for (const char in this.data.characters) {
      const item = this.data.characters[char];
      if (item.stage > 0 && item.nextReview <= now) {
        due.push(char);
      }
    }
    return due;
  },
  
  getStats() {
    return this.data.stats;
  }
};

SRS.init();
