// Data Loader module (V2.0)
const DataLoader = {
  db: {
    hiragana: {},
    katakana: {},
    kanji: {},
    stories: []
  },
  manifest: {
    kana: ["hiragana", "katakana"],
    kanji: ["n5", "n4", "n3", "n2", "n1"],
    grammar: ["n5", "n4"],
    sentences: ["n5", "n4"]
  },
  cacheMap: {},

  async loadAll() {
    if (this.cacheMap['fully_loaded']) return this.db;
    try {
      this.db.grammar = {};
      this.db.sentences = {};
      await Promise.all([
        ...this.manifest.kana.map(k => this.loadKana(k)),
        ...this.manifest.kanji.map(k => this.loadKanjiLevel(k)),
        ...this.manifest.grammar.map(k => this.loadGrammarLevel(k)),
        ...this.manifest.sentences.map(k => this.loadSentencesLevel(k)),
        this.loadStories()
      ]);
      this.cacheMap['fully_loaded'] = true;
      return this.db;
    } catch (e) {
      console.error("Failed to load data", e);
    }
  },

  async loadSentencesLevel(level) {
    if (this.cacheMap[`sentences_${level}`]) return this.db.sentences[level];
    const res = await fetch(`data/sentences/${level}.json`);
    this.db.sentences[level] = await res.json();
    this.cacheMap[`sentences_${level}`] = true;
    return this.db.sentences[level];
  },

  async loadGrammarLevel(level) {
    if (this.cacheMap[`grammar_${level}`]) return this.db.grammar[level];
    const res = await fetch(`data/grammar/${level}.json`);
    this.db.grammar[level] = await res.json();
    this.cacheMap[`grammar_${level}`] = true;
    return this.db.grammar[level];
  },

  async loadKana(script) {
    if (this.cacheMap[`kana_${script}`]) return this.db[script];
    const res = await fetch(`data/kana/${script}.json`);
    this.db[script] = await res.json();
    this.cacheMap[`kana_${script}`] = true;
    return this.db[script];
  },

  async loadKanjiLevel(level) {
    if (this.cacheMap[`kanji_${level}`]) return this.db.kanji[level];
    const res = await fetch(`data/kanji/${level}.json`);
    this.db.kanji[level] = await res.json();
    this.cacheMap[`kanji_${level}`] = true;
    return this.db.kanji[level];
  },

  async loadStories() {
    if (this.cacheMap['stories']) return this.db.stories;
    const res = await fetch(`data/stories/index.json`);
    this.db.stories = await res.json();
    this.cacheMap['stories'] = true;
    return this.db.stories;
  },

  async findCharacter(char) {
    if (!this.cacheMap['fully_loaded']) await this.loadAll();
    
    // Search hiragana
    for (let level in this.db.hiragana) {
      let found = this.db.hiragana[level].find(c => c.char === char);
      if (found) return found;
    }
    // Search katakana
    for (let level in this.db.katakana) {
      let found = this.db.katakana[level].find(c => c.char === char);
      if (found) return found;
    }
    // Search kanji
    for (let level in this.db.kanji) {
      let found = this.db.kanji[level].find(c => c.char === char);
      if (found) return found;
    }
    return null;
  }
};
