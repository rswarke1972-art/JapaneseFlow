const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/stories/index.json', 'utf8'));

data.story1.questions = [
  { type: "multiple-choice", question: "男はどうして店に入れませんでしたか？", options: ["お金がない", "閉まっていた", "勇気がなかった", "道がわからない"], answer: 2 },
  { type: "true-false", question: "男は毎日同じ道を歩きます。", options: ["True", "False"], answer: 0 },
  { type: "meaning", question: "What does 「勇気 (yuuki)」 mean?", options: ["Fear", "Courage", "Shop", "Road"], answer: 1 },
  { type: "multiple-choice", question: "店の中の人はどうでしたか？", options: ["怖い", "忙しい", "優しい", "静か"], answer: 2 },
  { type: "multiple-choice", question: "小さい勇気は何を作りますか？", options: ["おいしい料理", "大きい変化", "新しい店", "古い本"], answer: 1 }
];

data.story2.questions = [
  { type: "multiple-choice", question: "彼女は誰に傘をあげましたか？", options: ["友達", "男の人", "子供", "先生"], answer: 2 },
  { type: "true-false", question: "彼女は傘をあげて、少し濡れました。", options: ["True", "False"], answer: 0 },
  { type: "multiple-choice", question: "天気はどうでしたか？", options: ["晴れ", "雪", "雨", "曇り"], answer: 2 },
  { type: "true-false", question: "子供は傘をもらって泣きました。", options: ["True", "False"], answer: 1 },
  { type: "multiple-choice", question: "彼女は濡れた後、どう感じましたか？", options: ["怒った", "悲しい", "寒い", "嬉しい"], answer: 3 }
];

data.story3.questions = [
  { type: "multiple-choice", question: "彼は道で何を見つけましたか？", options: ["お金", "財布", "カード", "かばん"], answer: 1 },
  { type: "true-false", question: "彼は財布を自分の家に持って帰りました。", options: ["True", "False"], answer: 1 },
  { type: "multiple-choice", question: "彼は財布をどこに持って行きましたか？", options: ["警察", "学校", "店", "病院"], answer: 0 },
  { type: "true-false", question: "財布の持ち主は見つかりました。", options: ["True", "False"], answer: 0 },
  { type: "multiple-choice", question: "持ち主はどうしましたか？", options: ["怒った", "泣いた", "感謝した", "逃げた"], answer: 2 }
];

data.story4.questions = [
  { type: "multiple-choice", question: "彼女は古い箱の中で何を見つけましたか？", options: ["写真", "本", "手紙", "お金"], answer: 2 },
  { type: "true-false", question: "その手紙は先生からの手紙でした。", options: ["True", "False"], answer: 1 },
  { type: "multiple-choice", question: "手紙を読んで、彼女はどうしましたか？", options: ["怒った", "悲しいが笑った", "泣いた", "捨てた"], answer: 1 },
  { type: "true-false", question: "彼女は今、その友達に会うことができます。", options: ["True", "False"], answer: 1 },
  { type: "meaning", question: "What does 「思い出 (omoide)」 mean?", options: ["Friend", "Letter", "Memories", "Heart"], answer: 2 }
];

data.story5.questions = [
  { type: "multiple-choice", question: "彼は毎日何をしますか？", options: ["遊ぶ", "勉強する", "走る", "寝る"], answer: 1 },
  { type: "true-false", question: "彼はすぐに上手になりました。", options: ["True", "False"], answer: 1 },
  { type: "multiple-choice", question: "先生は何と言いましたか？", options: ["やめなさい", "少しずつでもいい", "もっと速く", "簡単だ"], answer: 1 },
  { type: "true-false", question: "時間が経って、彼は少しずつ上手になりました。", options: ["True", "False"], answer: 0 },
  { type: "multiple-choice", question: "努力は何に似ていますか？", options: ["すぐ結果になる", "結果にならない", "続けると強くなる", "無駄だ"], answer: 2 }
];

fs.writeFileSync('data/stories/index.json', JSON.stringify(data, null, 2));
console.log("Successfully updated stories with comprehension questions.");
