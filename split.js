const fs = require('fs');
const path = require('path');

const dataRaw = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(dataRaw);

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Create base data folder
ensureDir('data');
ensureDir('data/kana');
ensureDir('data/kanji');
ensureDir('data/stories');

// 1. Kana
if (data.hiragana) fs.writeFileSync('data/kana/hiragana.json', JSON.stringify(data.hiragana, null, 2));
if (data.katakana) fs.writeFileSync('data/kana/katakana.json', JSON.stringify(data.katakana, null, 2));

// 2. Kanji
if (data.kanji) {
    for (const level in data.kanji) {
        fs.writeFileSync(`data/kanji/${level}.json`, JSON.stringify(data.kanji[level], null, 2));
    }
}

// 3. Stories
if (data.stories) fs.writeFileSync('data/stories/index.json', JSON.stringify(data.stories, null, 2));

// Create a manifest file
const manifest = {
    kana: ['hiragana', 'katakana'],
    kanji: Object.keys(data.kanji || {}),
    stories: 'index.json'
};
fs.writeFileSync('data/manifest.json', JSON.stringify(manifest, null, 2));

console.log('Successfully split data.json into /data directory.');
