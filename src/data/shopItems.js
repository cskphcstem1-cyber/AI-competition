/** Shop catalog — backgrounds, cat looks, and real prizes bought with tokens */

/** @typedef {'background' | 'cat' | 'real'} ShopKind */

/**
 * @typedef {{
 *   id: string,
 *   kind: ShopKind,
 *   name: string,
 *   desc: string,
 *   price: number,
 *   preview: string,
 *   style?: Record<string, string>,
 *   className?: string,
 *   glyph?: string,
 *   slot?: 'hat' | 'eyes' | 'neck' | 'held',
 * }} ShopItem
 */

/** @type {ShopItem[]} */
export const SHOP_ITEMS = [
  {
    id: "bg-default",
    kind: "background",
    name: "實驗室藍圖",
    desc: "預設主頁背景",
    price: 0,
    preview: "from-sky-100 to-white",
    className: "home-theme-default",
    style: {
      background:
        "radial-gradient(ellipse 55% 40% at 12% 15%, rgba(14,165,233,0.18) 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 88% 18%, rgba(20,184,166,0.14) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(37,99,235,0.08) 0%, transparent 55%)",
    },
  },
  {
    id: "bg-ocean",
    kind: "background",
    name: "深海浪潮",
    desc: "青藍海浪光暈",
    price: 25,
    preview: "from-cyan-400 to-blue-700",
    className: "home-theme-ocean",
    style: {
      background:
        "radial-gradient(ellipse 60% 45% at 20% 20%, rgba(34,211,238,0.35) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 85% 30%, rgba(37,99,235,0.28) 0%, transparent 50%), linear-gradient(180deg, #e0f7fa 0%, #b3e5fc 45%, #e3f2fd 100%)",
    },
  },
  {
    id: "bg-sunset",
    kind: "background",
    name: "日落橘彩",
    desc: "溫暖橙粉漸層",
    price: 35,
    preview: "from-orange-300 to-rose-400",
    className: "home-theme-sunset",
    style: {
      background:
        "radial-gradient(ellipse 55% 40% at 15% 10%, rgba(251,146,60,0.35) 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 90% 20%, rgba(244,63,94,0.22) 0%, transparent 50%), linear-gradient(180deg, #fff7ed 0%, #ffedd5 50%, #ffe4e6 100%)",
    },
  },
  {
    id: "bg-forest",
    kind: "background",
    name: "森綠 codeland",
    desc: "翠綠自然氛圍",
    price: 30,
    preview: "from-emerald-300 to-teal-600",
    className: "home-theme-forest",
    style: {
      background:
        "radial-gradient(ellipse 55% 40% at 10% 20%, rgba(52,211,153,0.32) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 88% 25%, rgba(13,148,136,0.2) 0%, transparent 50%), linear-gradient(180deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)",
    },
  },
  {
    id: "bg-midnight",
    kind: "background",
    name: "午夜程式",
    desc: "深色星空感主頁",
    price: 50,
    preview: "from-slate-800 to-indigo-900",
    className: "home-theme-midnight",
    dark: true,
    style: {
      background:
        "radial-gradient(ellipse 50% 40% at 20% 15%, rgba(99,102,241,0.35) 0%, transparent 55%), radial-gradient(ellipse 40% 35% at 80% 20%, rgba(56,189,248,0.2) 0%, transparent 50%), linear-gradient(180deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)",
    },
  },
  {
    id: "bg-candy",
    kind: "background",
    name: "糖果粉彩",
    desc: "粉紫柔和背景",
    price: 40,
    preview: "from-pink-300 to-violet-400",
    className: "home-theme-candy",
    style: {
      background:
        "radial-gradient(ellipse 55% 40% at 18% 12%, rgba(244,114,182,0.3) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 85% 25%, rgba(167,139,250,0.28) 0%, transparent 50%), linear-gradient(180deg, #fdf2f8 0%, #f5f3ff 50%, #fae8ff 100%)",
    },
  },
  {
    id: "bg-sakura",
    kind: "background",
    name: "櫻花飛舞",
    desc: "主頁 WebGL 櫻花特效",
    price: 55,
    preview: "from-rose-200 to-pink-400",
    className: "home-theme-sakura",
    effect: "sakura",
    hideGrid: true,
    glyph: "🌸",
    scrim: "light",
    style: {
      background: "linear-gradient(180deg, #fff5f8 0%, #ffe9f0 50%, #fff7fb 100%)",
    },
  },
  {
    id: "bg-confetti",
    kind: "background",
    name: "彩色碎紙",
    desc: "主頁慶祝彩紙動畫",
    price: 45,
    preview: "from-amber-300 to-rose-500",
    className: "home-theme-confetti",
    effect: "confetti",
    hideGrid: true,
    glyph: "🎊",
    style: {
      background: "linear-gradient(180deg, #fff7ed 0%, #fce7f3 50%, #ede9fe 100%)",
    },
  },
  {
    id: "bg-fireworks",
    kind: "background",
    name: "煙火秀",
    desc: "主頁煙火動畫背景",
    price: 70,
    preview: "from-indigo-900 to-fuchsia-600",
    className: "home-theme-fireworks",
    effect: "fireworks",
    dark: true,
    hideGrid: true,
    glyph: "🎆",
    scrim: "dark",
    style: {
      background: "linear-gradient(180deg, #020617 0%, #1e1b4b 55%, #0f172a 100%)",
    },
  },
  {
    id: "cat-hat-party",
    kind: "cat",
    slot: "hat",
    name: "派對帽",
    desc: "貓咪戴上彩色尖帽",
    price: 18,
    preview: "from-rose-200 to-orange-300",
    glyph: "🎉",
  },
  {
    id: "cat-hat-wizard",
    kind: "cat",
    slot: "hat",
    name: "巫師帽",
    desc: "貓咪變成小小魔法師",
    price: 28,
    preview: "from-indigo-300 to-violet-500",
    glyph: "🧙",
  },
  {
    id: "cat-hat-crown",
    kind: "cat",
    slot: "hat",
    name: "小皇冠",
    desc: "貓咪當一天國王",
    price: 40,
    preview: "from-amber-200 to-yellow-400",
    glyph: "👑",
  },
  {
    id: "cat-hat-flower",
    kind: "cat",
    slot: "hat",
    name: "耳邊小花",
    desc: "別一朵花在貓咪耳邊",
    price: 16,
    preview: "from-pink-200 to-rose-400",
    glyph: "🌸",
  },
  {
    id: "cat-eyes-shades",
    kind: "cat",
    slot: "eyes",
    name: "酷炫墨鏡",
    desc: "貓咪戴上藍色墨鏡",
    price: 22,
    preview: "from-sky-300 to-slate-600",
    glyph: "😎",
  },
  {
    id: "cat-eyes-round",
    kind: "cat",
    slot: "eyes",
    name: "圓圓眼鏡",
    desc: "貓咪變得更斯文",
    price: 20,
    preview: "from-slate-200 to-sky-400",
    glyph: "👓",
  },
  {
    id: "cat-neck-bell",
    kind: "cat",
    slot: "neck",
    name: "鈴鐺項圈",
    desc: "叮鈴叮鈴的金色鈴鐺",
    price: 24,
    preview: "from-amber-200 to-orange-400",
    glyph: "🔔",
  },
  {
    id: "cat-neck-bow",
    kind: "cat",
    slot: "neck",
    name: "紅色蝴蝶結",
    desc: "繫一條可愛蝴蝶結",
    price: 18,
    preview: "from-rose-300 to-red-500",
    glyph: "🎀",
  },
  {
    id: "cat-neck-scarf",
    kind: "cat",
    slot: "neck",
    name: "綠圍巾",
    desc: "冬天也暖呼呼",
    price: 26,
    preview: "from-emerald-200 to-green-500",
    glyph: "🧣",
  },
  {
    id: "cat-neck-tie",
    kind: "cat",
    slot: "neck",
    name: "STEM 領帶",
    desc: "貓咪去上課了",
    price: 30,
    preview: "from-sky-300 to-blue-600",
    glyph: "👔",
  },
  {
    id: "cat-held-yarn",
    kind: "cat",
    slot: "held",
    name: "毛線球",
    desc: "貓咪最喜歡的玩具",
    price: 15,
    preview: "from-rose-200 to-pink-500",
    glyph: "🧶",
  },
  {
    id: "cat-held-book",
    kind: "cat",
    slot: "held",
    name: "小課本",
    desc: "貓咪也愛學習",
    price: 21,
    preview: "from-sky-200 to-indigo-400",
    glyph: "📘",
  },
  {
    id: "rw-fishball",
    kind: "real",
    name: "魚蛋",
    desc: "實體小食 · 請向老師兌換",
    price: 30,
    preview: "from-amber-400 to-orange-600",
    glyph: "🍡",
  },
  {
    id: "rw-sausage",
    kind: "real",
    name: "香腸",
    desc: "實體小食 · 請向老師兌換",
    price: 30,
    preview: "from-rose-400 to-red-600",
    glyph: "🌭",
  },
  {
    id: "rw-milk",
    kind: "real",
    name: "牛奶",
    desc: "實體飲品 · 請向老師兌換",
    price: 25,
    preview: "from-slate-100 to-sky-300",
    glyph: "🥛",
  },
  {
    id: "rw-print-car",
    kind: "real",
    name: "3D 打印小車",
    desc: "3D 打印玩具 · 請向老師兌換",
    price: 90,
    preview: "from-sky-400 to-blue-700",
    glyph: "🚗",
  },
  {
    id: "rw-print-robot",
    kind: "real",
    name: "3D 打印機械人",
    desc: "3D 打印玩具 · 請向老師兌換",
    price: 100,
    preview: "from-indigo-400 to-violet-700",
    glyph: "🤖",
  },
  {
    id: "rw-cat-toy",
    kind: "real",
    name: "貓咪玩具",
    desc: "實體玩具 · 請向老師兌換",
    price: 55,
    preview: "from-orange-300 to-amber-500",
    glyph: "🐱",
  },
  {
    id: "rw-dog-toy",
    kind: "real",
    name: "小狗玩具",
    desc: "實體玩具 · 請向老師兌換",
    price: 55,
    preview: "from-yellow-300 to-orange-500",
    glyph: "🐶",
  },
];

export const DEFAULT_OWNED = ["bg-default"];
export const DEFAULT_EQUIPPED = {
  background: "bg-default",
  decorations: [],
};

/** Tokens for answering a quiz question */
export const TOKENS_PER_ANSWER = 2;
export const TOKENS_CORRECT_BONUS = 3;
export const TOKENS_WRONG_PENALTY = 1;

/** Daily login reward */
export const DAILY_LOGIN_BASE = 10;
export const DAILY_LOGIN_STREAK_BONUS = 2;
export const DAILY_LOGIN_STREAK_CAP = 10; // max extra days counted for bonus

export function getShopItem(id) {
  return SHOP_ITEMS.find((item) => item.id === id) ?? null;
}

export function isDarkBackground(id) {
  return Boolean(getShopItem(id)?.dark);
}

export function tokensForAnswer(correct) {
  return correct
    ? TOKENS_PER_ANSWER + TOKENS_CORRECT_BONUS
    : -TOKENS_WRONG_PENALTY;
}

export function tokensFromQuiz(score, total) {
  const safeTotal = Math.max(0, Number(total) || 0);
  const safeScore = Math.max(0, Math.min(safeTotal, Number(score) || 0));
  const wrong = safeTotal - safeScore;
  return (
    safeScore * tokensForAnswer(true) + wrong * tokensForAnswer(false)
  );
}

/** @param {number} streak current streak after claiming (1+) */
export function tokensForDailyLogin(streak) {
  const s = Math.max(1, Number(streak) || 1);
  const bonusDays = Math.min(s - 1, DAILY_LOGIN_STREAK_CAP);
  return DAILY_LOGIN_BASE + bonusDays * DAILY_LOGIN_STREAK_BONUS;
}
