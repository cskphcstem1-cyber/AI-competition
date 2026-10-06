import { MATH_LEVELS } from "./mathLevels";

export const PRETEST_QUESTION_COUNT = 30;
/** Seconds per normal question */
export const TIME_LIMIT_SEC = 5;
/** Seconds for multi-blank questions (帶分數、餘數除法等) */
export const TIME_LIMIT_MULTI_SEC = 15;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[randInt(0, list.length - 1)];
}

function powInt(base, exp) {
  return base ** exp;
}

/** Build one question tagged with curriculum skillLevel (1–6 for pre-test). */
function makeQuestionForLevel(skillLevel) {
  if (skillLevel === 1) {
    return pick([
      () => {
        const a = randInt(1, 20);
        const b = randInt(1, 20);
        return { prompt: `${a} + ${b} =`, answer: a + b, skillLevel: 1 };
      },
      () => {
        const a = randInt(5, 20);
        const b = randInt(1, a);
        return { prompt: `${a} − ${b} =`, answer: a - b, skillLevel: 1 };
      },
    ])();
  }

  if (skillLevel === 2) {
    return pick([
      () => {
        const a = randInt(20, 80);
        const b = randInt(10, 40);
        return { prompt: `${a} + ${b} =`, answer: a + b, skillLevel: 2 };
      },
      () => {
        const a = randInt(40, 99);
        const b = randInt(10, a - 1);
        return { prompt: `${a} − ${b} =`, answer: a - b, skillLevel: 2 };
      },
      () => {
        const a = randInt(10, 40);
        const b = randInt(5, 30);
        const c = randInt(1, Math.min(20, a + b));
        return {
          prompt: `${a} + ${b} − ${c} =`,
          answer: a + b - c,
          skillLevel: 2,
        };
      },
    ])();
  }

  if (skillLevel === 3) {
    return pick([
      () => {
        const a = randInt(2, 12);
        const b = randInt(2, 12);
        return { prompt: `${a} × ${b} =`, answer: a * b, skillLevel: 3 };
      },
      () => {
        const a = randInt(11, 28);
        const b = randInt(2, 9);
        return { prompt: `${a} × ${b} =`, answer: a * b, skillLevel: 3 };
      },
      () => {
        // 次方：superscript 2^3（不用 * / 或「的n次方」）
        const a = randInt(2, 5);
        const b = randInt(2, 4);
        return {
          prompt: `${a}^${b} =`,
          answer: powInt(a, b),
          skillLevel: 3,
        };
      },
      () => {
        const a = randInt(2, 6);
        return {
          prompt: `${a}^2 =`,
          answer: powInt(a, 2),
          skillLevel: 3,
        };
      },
    ])();
  }

  if (skillLevel === 4) {
    return pick([
      () => {
        const b = randInt(2, 12);
        const q = randInt(2, 12);
        return { prompt: `${b * q} ÷ ${b} =`, answer: q, skillLevel: 4 };
      },
      () => {
        // 有餘數除法：雙空格  66/5 = ? ... ?
        const b = randInt(2, 9);
        const q = randInt(3, 15);
        const r = randInt(1, b - 1);
        const dividend = b * q + r;
        return {
          prompt: `${dividend}/${b} = ? ... ?`,
          answer: [q, r],
          plainSlash: true,
          skillLevel: 4,
        };
      },
      () => {
        // 除法用小數作答：  66/5 =  →  13.2（直線除法，非分數）
        const b = pick([2, 4, 5, 8, 10]);
        const q = randInt(2, 20);
        const r = randInt(1, b - 1);
        const dividend = b * q + r;
        const value = Math.round((dividend / b) * 100) / 100;
        return {
          prompt: `${dividend}/${b} =`,
          answer: String(value),
          plainSlash: true,
          skillLevel: 4,
        };
      },
      () => ({ prompt: `1/2 + 1/2 =`, answer: 1, skillLevel: 4 }),
      () => ({ prompt: `2/3 + 1/3 =`, answer: 1, skillLevel: 4 }),
      () => {
        const n = randInt(1, 3);
        return {
          prompt: `${n}/4 + ${4 - n}/4 =`,
          answer: 1,
          skillLevel: 4,
        };
      },
      () => {
        // 假分數 → 帶分數：填 整數 + 堆疊分數（如 3 ¾）
        const den = randInt(2, 9);
        const whole = randInt(1, 5);
        const rem = randInt(1, den - 1);
        const improper = whole * den + rem;
        return {
          prompt: `${improper}/${den} = ◆`,
          answer: [whole, rem],
          mixedBlank: { left: `${improper}/${den}`, den },
          skillLevel: 4,
        };
      },
      () => {
        // 帶分數 → 假分數：顯示 3 ¾，填分子
        const den = randInt(2, 9);
        const whole = randInt(1, 5);
        const rem = randInt(1, den - 1);
        const improper = whole * den + rem;
        return {
          prompt: `${whole} ${rem}/${den} = ?/${den}`,
          answer: improper,
          mixedLeft: { whole, num: rem, den },
          skillLevel: 4,
        };
      },
    ])();
  }

  if (skillLevel === 5) {
    return pick([
      () => {
        const a = randInt(1, 9) / 10;
        const b = randInt(1, 9) / 10;
        return {
          prompt: `${a} + ${b} =`,
          answer: Math.round((a + b) * 10) / 10,
          skillLevel: 5,
        };
      },
      () => {
        const a = randInt(11, 99) / 10;
        const b = randInt(1, 9) / 10;
        return {
          prompt: `${a} − ${b} =`,
          answer: Math.round((a - b) * 10) / 10,
          skillLevel: 5,
        };
      },
      () => {
        const a = randInt(2, 9) / 10;
        const b = randInt(2, 5);
        return {
          prompt: `${a} × ${b} =`,
          answer: Math.round(a * b * 10) / 10,
          skillLevel: 5,
        };
      },
      () => {
        // 分數 → 小數：堆疊分數 = 小數
        const den = pick([2, 4, 5, 10]);
        const num = randInt(1, den - 1);
        const value = num / den;
        return {
          prompt: `${num}/${den} =`,
          answer: String(value),
          skillLevel: 5,
        };
      },
      () => {
        // 小數 → 堆疊分數（填分子）
        const tenths = randInt(1, 9);
        return {
          prompt: `0.${tenths} =`,
          answer: tenths,
          fractionBlank: { den: 10 },
          skillLevel: 5,
        };
      },
      () => {
        // 百分位分數 → 小數：堆疊 65/100 = 0.65
        const hundredths = randInt(1, 99);
        const value = hundredths / 100;
        return {
          prompt: `${hundredths}/100 =`,
          answer: String(value),
          skillLevel: 5,
        };
      },
    ])();
  }

  if (skillLevel === 6) {
    return pick([
      () => {
        const a = randInt(1, 12);
        const b = randInt(1, 12);
        return { prompt: `−${a} + ${b} =`, answer: -a + b, skillLevel: 6 };
      },
      () => {
        const a = randInt(1, 12);
        const b = randInt(1, 12);
        return { prompt: `${a} + (−${b}) =`, answer: a - b, skillLevel: 6 };
      },
      () => {
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        return { prompt: `(−${a}) × ${b} =`, answer: -a * b, skillLevel: 6 };
      },
      () => {
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        return {
          prompt: `(−${a}) × (−${b}) =`,
          answer: a * b,
          skillLevel: 6,
        };
      },
    ])();
  }

  // Fallback: treat unknown as level 6 (no equations in pre-test)
  return makeQuestionForLevel(6);
}

/** Fresh pre-test covering Levels 1–6 (no equations). */
export function generateArithmeticPretest(count = PRETEST_QUESTION_COUNT) {
  // 5 questions per skill level for Levels 1–6
  const plan = [
    1, 1, 1, 1, 1,
    2, 2, 2, 2, 2,
    3, 3, 3, 3, 3,
    4, 4, 4, 4, 4,
    5, 5, 5, 5, 5,
    6, 6, 6, 6, 6,
  ];

  for (let i = plan.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [plan[i], plan[j]] = [plan[j], plan[i]];
  }

  const questions = [];
  const seen = new Set();

  for (let i = 0; i < count; i++) {
    const skillLevel = plan[i] ?? randInt(1, 6);
    let q;
    let tries = 0;
    do {
      q = makeQuestionForLevel(skillLevel);
      tries += 1;
    } while (seen.has(q.prompt) && tries < 25);

    seen.add(q.prompt);
    questions.push({
      id: i + 1,
      prompt: q.prompt,
      answer: Array.isArray(q.answer)
        ? q.answer.map(String)
        : String(q.answer),
      skillLevel: q.skillLevel,
      ...(q.mixedBlank ? { mixedBlank: q.mixedBlank } : {}),
      ...(q.mixedLeft ? { mixedLeft: q.mixedLeft } : {}),
      ...(q.plainSlash ? { plainSlash: true } : {}),
      ...(q.fractionBlank ? { fractionBlank: q.fractionBlank } : {}),
    });
  }

  return questions;
}

/** Canonical form for FIB answers (mixed: 2又1/3; decimals stripped of trailing 0). */
export function normalizeAnswer(value) {
  let s = String(value ?? "").trim().replace(/,/g, "");
  // 2 1/3 → 2又1/3
  s = s.replace(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/, "$1又$2/$3");
  s = s.replace(/\s+/g, "");
  // 2又1/3 already fine; also allow 2+1/3
  s = s.replace(/^(-?\d+)\+(\d+)\/(\d+)$/, "$1又$2/$3");
  if (/^-?\d+\.\d+$/.test(s)) {
    s = String(Number(s));
  }
  return s;
}

function parseMathValue(value) {
  const s = normalizeAnswer(value);
  if (!s) return null;

  const mixed = s.match(/^(-?\d+)又(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const num = Number(mixed[2]);
    const den = Number(mixed[3]);
    if (!den) return null;
    const sign = whole < 0 ? -1 : 1;
    return sign * (Math.abs(whole) + num / den);
  }

  const frac = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (frac) {
    const den = Number(frac[2]);
    if (!den) return null;
    return Number(frac[1]) / den;
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function isCorrectAnswer(userAnswer, expected) {
  if (Array.isArray(expected)) {
    const users = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    if (users.length !== expected.length) return false;
    return expected.every((item, i) => isCorrectAnswer(users[i], item));
  }

  const a = normalizeAnswer(userAnswer);
  const b = normalizeAnswer(expected);
  if (a === b) return true;

  const na = parseMathValue(a);
  const nb = parseMathValue(b);
  if (na == null || nb == null) return false;
  if (Math.abs(na - nb) > 1e-9) return false;

  // 帶分數題：必須寫成帶分數形式
  if (b.includes("又")) {
    return a.includes("又");
  }
  // 假分數題：必須寫成 a/b
  if (/^-?\d+\/-?\d+$/.test(b) && !Number.isInteger(nb)) {
    return /^-?\d+\/-?\d+$/.test(a);
  }

  return true;
}

/** Pretty-print the correct answer for feedback. */
export function formatQuizAnswer(question) {
  const answer = question?.answer;
  const prompt = String(question?.prompt ?? "");
  if (Array.isArray(answer)) {
    if (answer.length === 2 && prompt.includes("...")) {
      return `${answer[0]} ... ${answer[1]}`;
    }
    const den = question?.mixedBlank?.den;
    if (answer.length === 2 && den) {
      return `${answer[0]} ${answer[1]}/${den}`;
    }
    return answer.join("、");
  }
  return String(answer ?? "");
}

const LEVEL_META = Object.fromEntries(
  MATH_LEVELS.map((item) => [
    item.level,
    {
      level: item.level,
      label: `Level ${item.level}`,
      zh: `程度 ${item.level}`,
      title: item.title,
      titleEn: item.titleEn,
      message: `根據你答對的題型，適合從「${item.title}」開始學習。`,
      color: item.color,
    },
  ]),
);

/**
 * Place by which skill levels were answered correctly (≥50% on that level),
 * not by overall score percentage.
 */
export function getMathLevelFromResults(results) {
  const stats = {};
  for (const row of results) {
    const L = Number(row.skillLevel) || 1;
    if (!stats[L]) stats[L] = { correct: 0, total: 0 };
    stats[L].total += 1;
    if (row.correct) stats[L].correct += 1;
  }

  let assigned = 1;
  for (let L = 1; L <= 6; L++) {
    const s = stats[L];
    if (!s || s.total === 0) continue;
    if (s.correct * 2 >= s.total) assigned = L;
  }

  return LEVEL_META[assigned] ?? LEVEL_META[1];
}

export const MATH_LEVEL_KEY = "codekids-math-level";
