export const CHAPTERS = [
  {
    id: 0,
    title: "下載與安裝 Python",
    description:
      "從官方網站下載 Python 3，完成安裝後才能開始寫程式。",
    path: "/python/chapter-0",
    available: true,
  },
  {
    id: 1,
    title: "編程入門與 Python 基礎",
    description:
      "認識編程、Python 特點與版本、交互模式、IDLE 環境，以及輸入處理輸出與 print 指令。",
    path: "/python/chapter-1",
    available: true,
  },
  {
    id: 2,
    title: "數據類型",
    description:
      "認識整數、浮點數、字符串、布林值與列表，並練習判斷數據屬於哪一類。",
    path: "/python/chapter-2",
    available: true,
  },
  {
    id: 3,
    title: "註釋與文檔字符串",
    description:
      "學習單行註釋 # 與多行文檔字符串（docstring）的寫法與用途。",
    path: "/python/chapter-3",
    available: true,
  },
  {
    id: 4,
    title: "變量（Variables）",
    description:
      "變量賦值與輸出、重新賦值、命名規則、底線與駝峰命名，以及編程練習。",
    path: "/python/chapter-4",
    available: true,
  },
  {
    id: 5,
    title: "保留字（Keywords）",
    description:
      "認識 Python 保留字，了解它們不能用作變量名，並區分內建函數。",
    path: "/python/chapter-5",
    available: true,
  },
  {
    id: 6,
    title: "輸出指令 print()",
    description:
      "學習 print() 基本用法、三引號，以及 sep、end 參數控制輸出格式。",
    path: "/python/chapter-6",
    available: true,
  },
  {
    id: 7,
    title: "輸入指令 input()",
    description:
      "使用 input() 從鍵盤讀取文字、存入變量。",
    path: "/python/chapter-7",
    available: true,
  },
  {
    id: 8,
    title: "數據類型轉換",
    description:
      "學習 int()、str()、float() 與 eval() 把不同類型的數據互相轉換。",
    path: "/python/chapter-8",
    available: true,
  },
  {
    id: 9,
    title: "數學運算符（Math Operators）",
    description:
      "學習加減乘除、整數除法、取餘、指數、負號，以及運算優先級與結果類型。",
    path: "/python/chapter-9",
    available: true,
  },
  {
    id: 10,
    title: "字符串運算（String Operations）",
    description:
      "學習字串相加（串接）、字串相乘（重複），以及相關運算優先級。",
    path: "/python/chapter-10",
    available: true,
  },
  {
    id: 11,
    title: "布林值與邏輯",
    description:
      "布林資料類型、比較運算符、布林邏輯與真假範圍，共四個小節。",
    path: "/python/chapter-11",
    available: true,
    sections: [
      {
        id: "11.1",
        title: "布林值（資料類型）",
        titleEn: "Booleans (data type)",
        description: "真與假、用途與布林值轉換",
        descriptionEn: "True and False, uses, and converting to boolean",
        path: "/python/chapter-11-1",
      },
      {
        id: "11.2",
        title: "比較運算符",
        titleEn: "Comparison operators",
        description: "等於、不等於、大於、小於與布林結果",
        descriptionEn: "Equal, not equal, greater, less, and boolean results",
        path: "/python/chapter-11-2",
      },
      {
        id: "11.3",
        title: "布林邏輯運算",
        titleEn: "Boolean logic",
        description: "且、或、非真值表與優先順序",
        descriptionEn: "and, or, not, truth tables, and order",
        path: "/python/chapter-11-3",
      },
      {
        id: "11.4",
        title: "布林邏輯運算（進階）",
        titleEn: "Boolean logic (advanced)",
        description: "真假範圍與且／或回傳值",
        descriptionEn: "Truthy ranges and what and / or return",
        path: "/python/chapter-11-4",
      },
    ],
  },
  {
    id: 12,
    title: "海龜繪圖模組 (turtle)",
    description:
      "導入模組、基本運動、畫筆顏色、海龜控制，以及畫布、形狀與文字，共四個小節。",
    path: "/python/chapter-12",
    available: true,
    sections: [
      {
        id: "12.1",
        title: "導入與基本運動",
        titleEn: "Import and basic movement",
        description: "模組導入、前進後退、左右旋轉、繪製圓形",
        descriptionEn: "Import the module, move, turn, and draw circles",
        path: "/python/chapter-12-1",
      },
      {
        id: "12.2",
        title: "畫筆與顏色",
        titleEn: "Pen and color",
        description: "設定顏色、筆觸粗細、提筆落筆、清除畫面、圖形填色",
        descriptionEn: "Color, pen size, pen up/down, clear, and fill",
        path: "/python/chapter-12-2",
      },
      {
        id: "12.3",
        title: "海龜控制",
        titleEn: "Turtle control",
        description: "顯示隱藏、繪圖速度、座標移動、方向設定、圓點、歸位、重置",
        descriptionEn: "Show/hide, speed, goto, heading, dots, home, reset",
        path: "/python/chapter-12-3",
      },
      {
        id: "12.4",
        title: "畫布、形狀與文字",
        titleEn: "Canvas, shapes, and text",
        description: "視窗設定、背景顏色、海龜外形、文字輸出、蓋章、結束繪圖",
        descriptionEn: "Window, background, turtle shape, text, stamp, done",
        path: "/python/chapter-12-4",
      },
    ],
  },
];

/** Learning order for “下一章” buttons (quiz id / section key → next path + label) */
export const NEXT_CHAPTER = {
  "0": { to: "/python/chapter-1", label: "下一章 →", labelEn: "Next chapter →" },
  "1": { to: "/python/chapter-2", label: "下一章 →", labelEn: "Next chapter →" },
  "2": { to: "/python/chapter-3", label: "下一章 →", labelEn: "Next chapter →" },
  "3": { to: "/python/chapter-4", label: "下一章 →", labelEn: "Next chapter →" },
  "4": { to: "/python/chapter-5", label: "下一章 →", labelEn: "Next chapter →" },
  "5": { to: "/python/chapter-6", label: "下一章 →", labelEn: "Next chapter →" },
  "6": { to: "/python/chapter-7", label: "下一章 →", labelEn: "Next chapter →" },
  "7": { to: "/python/chapter-8", label: "下一章 →", labelEn: "Next chapter →" },
  "8": { to: "/python/chapter-9", label: "下一章 →", labelEn: "Next chapter →" },
  "9": { to: "/python/chapter-10", label: "下一章 →", labelEn: "Next chapter →" },
  "10": { to: "/python/chapter-11", label: "下一章 →", labelEn: "Next chapter →" },
  "11": { to: "/python/chapter-11-1", label: "下一小節 →", labelEn: "Next section →" },
  "11-1": { to: "/python/chapter-11-2", label: "下一小節 →", labelEn: "Next section →" },
  "11-2": { to: "/python/chapter-11-3", label: "下一小節 →", labelEn: "Next section →" },
  "11-3": { to: "/python/chapter-11-4", label: "下一小節 →", labelEn: "Next section →" },
  "11-4": { to: "/python/chapter-12", label: "下一章 →", labelEn: "Next chapter →" },
  "12": { to: "/python/chapter-12-1", label: "下一小節 →", labelEn: "Next section →" },
  "12-1": { to: "/python/chapter-12-2", label: "下一小節 →", labelEn: "Next section →" },
  "12-2": { to: "/python/chapter-12-3", label: "下一小節 →", labelEn: "Next section →" },
  "12-3": { to: "/python/chapter-12-4", label: "下一小節 →", labelEn: "Next section →" },
  "12-4": { to: "/python/chapters", label: "完成 · 回目錄 →", labelEn: "Done · Back to catalog →" },
};
