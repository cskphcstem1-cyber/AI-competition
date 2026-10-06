const TOTAL = 15;

function shuffle(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function pickInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function uniqueInts(min, max, count) {
  const set = new Set();
  while (set.size < count) set.add(pickInt(min, max));
  return [...set];
}

function compareQuestions() {
  const items = [];
  const pairs = uniqueInts(1, 20, 12);
  for (let i = 0; i < 6; i += 1) {
    const a = pairs[i];
    let b = pairs[i + 6];
    if (a === b) b = a + 1;
    const less = a < b;
    items.push({
      id: `ltgt-${i}`,
      kind: "choice",
      prompt: `${a}  □  ${b}`,
      promptEn: `${a}  □  ${b}`,
      hint: "選正確的符號",
      hintEn: "Pick the right sign",
      options: ["<", ">", "="],
      answer: less ? 0 : 1,
    });
  }
  for (let i = 0; i < 3; i += 1) {
    const equal = i % 2 === 0;
    const a = pickInt(2, 15);
    const b = equal ? a : a + pickInt(1, 6);
    items.push({
      id: `eq-${i}`,
      kind: "choice",
      prompt: `${a}  □  ${b}`,
      promptEn: `${a}  □  ${b}`,
      hint: "這兩數相同還是不同？",
      hintEn: "Are the two numbers the same?",
      options: ["=", "≠"],
      optionsEn: ["=", "≠"],
      answer: equal ? 0 : 1,
    });
  }
  const leCases = [
    [4, 4, true],
    [3, 9, true],
    [11, 6, false],
  ];
  leCases.forEach(([a, b, ok], i) => {
    items.push({
      id: `le-${i}`,
      kind: "choice",
      prompt: `${a} ≤ ${b}`,
      promptEn: `${a} ≤ ${b}`,
      hint: "這句是對還是錯？",
      hintEn: "Is this true or false?",
      options: ["對 / True", "錯 / False"],
      optionsEn: ["True", "False"],
      answer: ok ? 0 : 1,
    });
  });
  const geCases = [
    [10, 10, true],
    [12, 5, true],
    [2, 8, false],
  ];
  geCases.forEach(([a, b, ok], i) => {
    items.push({
      id: `ge-${i}`,
      kind: "choice",
      prompt: `${a} ≥ ${b}`,
      promptEn: `${a} ≥ ${b}`,
      hint: "這句是對還是錯？",
      hintEn: "Is this true or false?",
      options: ["對 / True", "錯 / False"],
      optionsEn: ["True", "False"],
      answer: ok ? 0 : 1,
    });
  });
  return shuffle(items).slice(0, TOTAL);
}

function binaryQuestions() {
  const items = [];
  uniqueInts(1, 31, 8).forEach((n, i) => {
    items.push({
      id: `d2b-${i}`,
      kind: "fill",
      prompt: `${n}₁₀ = ?₂`,
      promptEn: `${n}₁₀ = ?₂`,
      hint: "寫成二進制（只要 0 和 1）",
      hintEn: "Write it in binary (only 0 and 1)",
      answer: n.toString(2),
    });
  });
  uniqueInts(2, 31, 7).forEach((n, i) => {
    items.push({
      id: `b2d-${i}`,
      kind: "fill",
      prompt: `${n.toString(2)}₂ = ?₁₀`,
      promptEn: `${n.toString(2)}₂ = ?₁₀`,
      hint: "寫成十進制",
      hintEn: "Write it in denary",
      answer: String(n),
    });
  });
  return shuffle(items).slice(0, TOTAL);
}

const HEX_LETTERS = [
  ["A", "10"],
  ["B", "11"],
  ["C", "12"],
  ["D", "13"],
  ["E", "14"],
  ["F", "15"],
];

function hexQuestions() {
  const items = HEX_LETTERS.map(([letter, value], i) => ({
    id: `letter-${i}`,
    kind: "fill",
    prompt: `${letter}₁₆ = ?₁₀`,
    promptEn: `${letter}₁₆ = ?₁₀`,
    hint: "A=10 … F=15",
    hintEn: "A=10 … F=15",
    answer: value,
  }));
  uniqueInts(16, 60, 5).forEach((n, i) => {
    items.push({
      id: `d2h-${i}`,
      kind: "fill",
      prompt: `${n}₁₀ = ?₁₆`,
      promptEn: `${n}₁₀ = ?₁₆`,
      hint: "寫成十六進制（10–15 用 A–F）",
      hintEn: "Write it in hex (use A–F for 10–15)",
      answer: n.toString(16).toUpperCase(),
    });
  });
  uniqueInts(16, 80, 4).forEach((n, i) => {
    items.push({
      id: `h2d-${i}`,
      kind: "fill",
      prompt: `${n.toString(16).toUpperCase()}₁₆ = ?₁₀`,
      promptEn: `${n.toString(16).toUpperCase()}₁₆ = ?₁₀`,
      hint: "寫成十進制",
      hintEn: "Write it in denary",
      answer: String(n),
    });
  });
  return shuffle(items).slice(0, TOTAL);
}

export const MATH_SKILL_QUIZZES = {
  compare: {
    title: "比較練習",
    titleEn: "Compare practice",
    chapterPath: "/math/compare",
    label: "比較",
    labelEn: "Compare",
    makeQuestions: compareQuestions,
  },
  binary: {
    title: "二進制練習",
    titleEn: "Binary practice",
    chapterPath: "/math/binary",
    label: "二進制",
    labelEn: "Binary",
    makeQuestions: binaryQuestions,
  },
  hex: {
    title: "十六進制練習",
    titleEn: "Hex practice",
    chapterPath: "/math/hex",
    label: "十六進制",
    labelEn: "Hexadecimal",
    makeQuestions: hexQuestions,
  },
};

export function getMathSkillQuiz(topicId) {
  const meta = MATH_SKILL_QUIZZES[topicId];
  if (!meta) return null;
  return { ...meta, questions: meta.makeQuestions() };
}

export function normalizeSkillAnswer(raw) {
  return String(raw ?? "")
    .trim()
    .replace(/^0x/i, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

export function isSkillAnswerCorrect(user, expected) {
  return normalizeSkillAnswer(user) === normalizeSkillAnswer(expected);
}
