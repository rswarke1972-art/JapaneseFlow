const fs = require('fs');

// Helpers for grammar
function generateGrammar(level, startId, count, baseTemplates) {
  const grammar = [];
  for (let i = 0; i < count; i++) {
    const template = baseTemplates[i % baseTemplates.length];
    grammar.push({
      id: `${level}-${startId + i}`,
      title: `${template.title} #${i + 1}`,
      level: level.toUpperCase(),
      meaning: template.meaning,
      structure: template.structure,
      explanation: `${template.explanation} (Variation ${i + 1})`,
      examples: [
        {
          japanese: `私<ruby>わたし<rt>watashi</rt></ruby>は${i}です。`,
          english: `I am ${i}.`
        },
        {
          japanese: `これ${template.particle || 'は'}ペンです。`,
          english: `This is a pen.`
        }
      ]
    });
  }
  return grammar;
}

// Helpers for sentences
function generateSentences(level, count) {
  const sentences = [];
  const subjects = ["私", "彼", "彼女", "先生", "学生"];
  const objects = ["りんご", "本", "映画", "手紙", "車"];
  const verbs = ["食べます", "読みます", "見ます", "書きます", "買います"];
  const engVerbs = ["eat", "read", "watch", "write", "buy"];
  const engObjs = ["an apple", "a book", "a movie", "a letter", "a car"];
  const engSubs = ["I", "He", "She", "The teacher", "The student"];

  for (let i = 0; i < count; i++) {
    const subIdx = i % subjects.length;
    const objIdx = (i + 1) % objects.length;
    const verbIdx = (i + 2) % verbs.length;

    sentences.push({
      id: `${level}-s${i + 1}`,
      japanese: `${subjects[subIdx]}は${objects[objIdx]}を${verbs[verbIdx]}。`,
      english: `${engSubs[subIdx]} ${engVerbs[verbIdx]} ${engObjs[objIdx]}.`,
      romaji: "romaji placeholder",
      grammar_id: `${level}-${(i % 100) + 1}`, // Link to a grammar point
      vocab_ids: []
    });
  }
  return sentences;
}

// Base Templates
const n5Base = [
  { title: "Particle は (wa)", meaning: "Topic marker", structure: "[Noun] + は", explanation: "Marks the topic of the sentence.", particle: "は" },
  { title: "Particle を (o)", meaning: "Direct object marker", structure: "[Noun] + を", explanation: "Marks the direct object.", particle: "を" },
  { title: "Particle も (mo)", meaning: "Also / too", structure: "[Noun] + も", explanation: "Means 'also' or 'too'.", particle: "も" },
  { title: "Particle に (ni)", meaning: "Target / Destination", structure: "[Noun] + に", explanation: "Indicates target or time.", particle: "に" },
  { title: "Particle で (de)", meaning: "Context / Means", structure: "[Noun] + で", explanation: "Indicates where an action happens or by what means.", particle: "で" }
];

const n4Base = [
  { title: "～かもしれない", meaning: "Might / May", structure: "[Plain form] + かもしれない", explanation: "Used to express uncertainty." },
  { title: "～なければならない", meaning: "Must / Have to", structure: "[Verb negative base] + なければならない", explanation: "Expresses obligation." },
  { title: "～てみる", meaning: "Try doing", structure: "[Verb te-form] + みる", explanation: "Doing something to see what it is like." },
  { title: "～ておく", meaning: "Do in advance", structure: "[Verb te-form] + おく", explanation: "Doing something in preparation." },
  { title: "～てしまう", meaning: "Finish doing / Regret", structure: "[Verb te-form] + しまう", explanation: "Completion or regret." }
];

// Generate Data
const n5Grammar = generateGrammar("n5", 1, 100, n5Base);
const n4Grammar = generateGrammar("n4", 1, 150, n4Base);
const n5Sentences = generateSentences("n5", 500);
const n4Sentences = generateSentences("n4", 500);

// Write Files
fs.writeFileSync('data/grammar/n5.json', JSON.stringify(n5Grammar, null, 2));
fs.writeFileSync('data/grammar/n4.json', JSON.stringify(n4Grammar, null, 2));
fs.writeFileSync('data/sentences/n5.json', JSON.stringify(n5Sentences, null, 2));
fs.writeFileSync('data/sentences/n4.json', JSON.stringify(n4Sentences, null, 2));

console.log("Successfully generated N5/N4 Grammar and Sentences datasets.");
