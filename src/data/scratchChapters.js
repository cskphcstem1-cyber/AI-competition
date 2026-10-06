/** Scratch programming — 7 project modules */

export const SCRATCH_CHAPTERS = [
  {
    id: 1,
    title: "角色移動與造型動畫",
    titleEn: "Character Motion & Sprite Animation",
    level: "Beginner",
    categories: ["動作 (Motion)", "外觀 (Looks)"],
    categoriesEn: ["Motion", "Looks"],
    concepts: ["2D 座標 (X/Y)", "影格序列", "相對移動 vs 絕對移動"],
    conceptsEn: ["2D coordinates (X/Y)", "Costume frames in a row", "Relative move vs absolute move"],
    description:
      "用座標控制角色移動，並透過造型切換做出走路與游泳等動畫。",
    descriptionEn:
      "Move a sprite with coordinates, and switch costumes for walk or swim animations.",
    path: "/scratch/chapter/1",
    available: true,
    overview:
      "學習在二維座標系中控制角色：X 軸左右、Y 軸上下。透過連續切換造型，做出流暢的走路循環與畫面轉場。",
    overviewEn:
      "Control a sprite on a 2D grid: X left/right, Y up/down. Switch costumes to make a smooth walk cycle.",
    blocks: [
      "移動 (10) 點 · 右轉 / 左轉 (15) 度",
      "移到 (隨機位置) · 定位到 x: () y: ()",
      "滑行 (1) 秒到 … · 面向 (90) 度 / 鼠標",
      "下一個造型 · 改變尺寸 · 顯示 / 隱藏",
    ],
    blocksEn: [
      "move (10) steps · turn right / turn left (15) degrees",
      "go to (random position) · go to x: () y: ()",
      "glide (1) secs to … · point in direction (90) / mouse-pointer",
      "next costume · change size · show / hide",
    ],
    starter: {
      title: "第一段程式（動作積木）",
      titleEn: "First script (Motion blocks)",
      steps: [
        "點左邊藍色「動作」——就是你看到的這些積木",
        "先點黃色「事件」，把「當綠旗被點擊」拖到中間空白區",
        "再接「移動 (10) 點」在下面",
        "可再接「右轉 (15) 度」或「定位到 x: (0) y: (0)」",
        "按綠旗 ▶：貓咪會動！想平滑移動就用「滑行 (1) 秒到 …」",
      ],
      stepsEn: [
        "Click blue Motion on the left — those are the blocks you see",
        "Click yellow Events, then drag “when green flag clicked” to the middle",
        "Snap “move (10) steps” under it",
        "You can add “turn right (15) degrees” or “go to x: (0) y: (0)”",
        "Press the green flag ▶: the cat moves! For smooth motion use “glide (1) secs to …”",
      ],
      blockGuide: [
        { name: "移動 (10) 點", nameEn: "move (10) steps", tip: "往面向方向走幾步（相對移動）", tipEn: "Walk a few steps the way you are facing (relative move)" },
        { name: "右轉 / 左轉", nameEn: "turn right / turn left", tip: "改變面向角度", tipEn: "Change facing angle" },
        { name: "移到 (隨機位置)", nameEn: "go to (random position)", tip: "瞬移到舞台隨機一點", tipEn: "Jump to a random stage point" },
        { name: "定位到 x: y:", nameEn: "go to x: y:", tip: "瞬移到指定座標（絕對位置）", tipEn: "Jump to an exact x, y (absolute)" },
        { name: "滑行 … 秒到 …", nameEn: "glide … secs to …", tip: "用時間平滑移動（不是瞬移）", tipEn: "Move smoothly over time (not a jump)" },
        { name: "面向 … 度 / 鼠標", nameEn: "point in direction / towards mouse", tip: "決定角色朝哪裡看", tipEn: "Choose which way the sprite looks" },
      ],
    },
    activity: {
      name: "動畫水族館或走路故事",
      nameEn: "Animated aquarium or walking story",
      detail:
        "打造互動水底世界：海洋生物依座標游泳、靠近時變大，並循環游泳造型。",
      detailEn:
        "Build an interactive underwater world: sea animals swim on coordinates, grow when close, and loop swim costumes.",
    },
    outcomes: [
      "理解 2D 直角座標系定位",
      "用 wait () 控制影格節奏完成序列動畫",
      "分辨 定位到（瞬移）與 滑行（平滑移動）",
    ],
    outcomesEn: [
      "Place a sprite using a 2D x, y grid",
      "Use wait () so costume frames play at a nice speed",
      "Tell apart go to (a jump) and glide (smooth move)",
    ],
  },
  {
    id: 2,
    title: "互動說故事與多媒體觸發",
    titleEn: "Interactive Storytelling & Multimedia Triggers",
    level: "Beginner–Intermediate",
    categories: ["事件 (Events)", "外觀 (Looks)", "音效 (Sound)"],
    categoriesEn: ["Events", "Looks", "Sound"],
    concepts: ["事件驅動程式", "對話節奏", "音效同步"],
    conceptsEn: ["Event-driven code", "Talk timing", "Matching sound to the story"],
    description:
      "用綠旗、按鍵、點擊與廣播，串起對話、音效與背景切換。",
    descriptionEn:
      "Use the green flag, keys, clicks, and broadcasts to join speech, sound, and backdrop changes.",
    path: "/scratch/chapter/2",
    available: true,
    overview:
      "事件驅動程式會在特定觸發時才執行。學習把語音、對話與場景變化串成互動媒體。",
    overviewEn:
      "Event-driven code runs when something happens. Join voice, speech, and scene changes into an interactive story.",
    blocks: [
      "when green flag clicked、when key pressed、when this sprite clicked",
      "say () for () seconds、think () for () seconds",
      "play sound () until done、start sound ()",
      "broadcast ()、when I receive ()",
    ],
    blocksEn: [
      "when green flag clicked · when key pressed · when this sprite clicked",
      "say () for () seconds · think () for () seconds",
      "play sound () until done · start sound ()",
      "broadcast () · when I receive ()",
    ],
    activity: {
      name: "選擇結局數位漫畫",
      nameEn: "Choose-your-ending comic",
      detail:
        "設計多場景漫畫：點角色觸發對話與旁白，並用廣播通知舞台切換背景。",
      detailEn:
        "Make a comic with many scenes: click a sprite to talk, then broadcast so the stage switches the backdrop.",
    },
    outcomes: [
      "用廣播協調多個角色互動",
      "用延遲避免對話氣泡重疊",
      "整合圖片與音效建構敘事",
    ],
    outcomesEn: [
      "Use broadcast so several sprites act together",
      "Use waits so speech bubbles do not overlap",
      "Mix pictures and sounds to tell a story",
    ],
  },
  {
    id: 3,
    title: "互動控制、迴圈與碰撞",
    titleEn: "Interactive Controls, Loops, and Collision Logic",
    level: "Intermediate",
    categories: ["控制 (Control)", "偵測 (Sensing)"],
    categoriesEn: ["Control", "Sensing"],
    concepts: ["條件判斷 (If-Then)", "重複 (Forever / Repeat)", "碰撞偵測"],
    conceptsEn: ["If-then choices", "Loops (forever / repeat)", "Collision checks"],
    description:
      "用永遠迴圈與條件判斷，讓角色對按鍵與障礙做出即時反應。",
    descriptionEn:
      "Use forever loops and if-then so a sprite reacts to keys and obstacles right away.",
    path: "/scratch/chapter/3",
    available: true,
    overview:
      "角色會持續偵測玩家輸入與環境。學習用布林條件驅動即時互動遊戲。",
    overviewEn:
      "The sprite keeps checking player input and the world. Use true/false conditions to make a live game.",
    blocks: [
      "forever、repeat ()",
      "if < > then、if < > then ... else",
      "key () pressed?、touching [color]?、touching [sprite]?",
    ],
    blocksEn: [
      "forever · repeat ()",
      "if < > then · if < > then ... else",
      "key () pressed? · touching [color]? · touching [sprite]?",
    ],
    activity: {
      name: "迷宮闖關遊戲",
      nameEn: "Maze challenge game",
      detail:
        "用方向鍵操控角色。碰到牆壁顏色回到起點；碰到終點線進入下一關。",
      detailEn:
        "Steer with the arrow keys. Touch wall color to go back to start. Touch the finish line to go to the next level.",
    },
    outcomes: [
      "組合條件與迴圈寫出基本演算法",
      "用顏色與觸碰實作碰撞",
      "做出靈敏的玩家移動",
    ],
    outcomesEn: [
      "Join if-then and loops into a simple game plan",
      "Use color and touching for collisions",
      "Make snappy player movement",
    ],
  },
  {
    id: 4,
    title: "動態狀態：分數、生命與計時",
    titleEn: "Dynamic State Tracking: Scores, Health, and Timers",
    level: "Intermediate",
    categories: ["變數 (Variables)", "控制 (Control)"],
    categoriesEn: ["Variables", "Control"],
    concepts: ["資料抽象", "全域 vs 區域", "遊戲狀態管理"],
    conceptsEn: ["Storing a number in a name", "For all sprites vs for this sprite", "Keeping game state"],
    description:
      "用變數做分數板、生命值、倒數計時與遊戲結束條件。",
    descriptionEn:
      "Use variables for score, lives, a countdown, and the game-over rule.",
    path: "/scratch/chapter/4",
    available: true,
    overview:
      "變數可在執行中改變。學習建立計分、生命、高分紀錄與勝負條件。",
    overviewEn:
      "Variables can change while the game runs. Make score, lives, high score, and win/lose rules.",
    blocks: [
      "make a variable",
      "set [variable] to ()、change [variable] by ()",
      "stop [all]",
    ],
    blocksEn: [
      "Make a Variable",
      "set [variable] to () · change [variable] by ()",
      "stop [all]",
    ],
    activity: {
      name: "接東西街機遊戲",
      nameEn: "Catch-the-items arcade",
      detail:
        "物品從上方隨機落下。接到好東西 Score +1；碰到危險或漏接 Lives −1。倒數到 0 結束遊戲。",
      detailEn:
        "Items fall from the top. Catch a good one: Score +1. Hit danger or miss: Lives −1. When the timer hits 0, the game ends.",
    },
    flowchart: [
      "開始 → Score = 0，Lives = 3，Timer = 30",
      "物品從上方隨機落下",
      "接到物品？→ Score +1",
      "碰到危險？→ Lives −1",
      "Lives = 0 或 Timer = 0？→ 是 → 停止全部",
    ],
    flowchartEn: [
      "Start → Score = 0, Lives = 3, Timer = 30",
      "Items drop from the top at random",
      "Caught an item? → Score +1",
      "Hit danger? → Lives −1",
      "Lives = 0 or Timer = 0? → Yes → stop all",
    ],
    outcomes: [
      "理解變數初始化（開局重設）",
      "在遊戲過程追蹤數量資料",
      "實作勝負與超時狀態邊界",
    ],
    outcomesEn: [
      "Reset variables at the start of a game",
      "Track numbers like score while you play",
      "Stop the game on win, lose, or timeout",
    ],
  },
  {
    id: 5,
    title: "運算思維與自動化邏輯",
    titleEn: "Algorithmic Math & Automated Logic",
    level: "Intermediate–Advanced",
    categories: ["運算 (Operators)", "變數 (Variables)", "偵測 (Sensing)"],
    categoriesEn: ["Operators", "Variables", "Sensing"],
    concepts: ["算數運算式", "隨機", "字串串接", "邏輯運算 (AND / OR / NOT)"],
    conceptsEn: ["Math expressions", "Random numbers", "Joining text", "Logic (AND / OR / NOT)"],
    description:
      "用隨機與運算子做出不可預測的遊戲，以及自動出題的小工具。",
    descriptionEn:
      "Use random and operators for surprise games and a quiz that writes its own questions.",
    path: "/scratch/chapter/5",
    available: true,
    overview:
      "用數學積木做隨機行為，並打造互動教育工具（如自動數學測驗）。",
    overviewEn:
      "Use math blocks for random behavior, and build a helper like an auto math quiz.",
    blocks: [
      "pick random () to ()",
      "算術 (+ − × ÷) 與比較 (> < =)",
      "join () ()",
      "ask () and wait、answer",
    ],
    blocksEn: [
      "pick random () to ()",
      "math (+ − × ÷) and compare (> < =)",
      "join () ()",
      "ask () and wait · answer",
    ],
    activity: {
      name: "自動數學小老師與算命機",
      nameEn: "Auto math teacher and fortune machine",
      detail:
        "產生兩個隨機數，請玩家輸入總和，判斷 answer 是否等於 num1 + num2，並用動態文字回饋。",
      detailEn:
        "Pick two random numbers. Ask the player for the sum. Check if answer equals num1 + num2, then reply with joined text.",
    },
    outcomes: [
      "在條件中組合變數與比較運算",
      "用字串串接產生個人化訊息",
      "把機率與隨機納入設計",
    ],
    outcomesEn: [
      "Put variables and compares inside if-then",
      "Join text to make a personal message",
      "Use chance and random in your design",
    ],
  },
  {
    id: 6,
    title: "2D 物理與平台跳躍",
    titleEn: "2D Physics & Platformer Mechanics",
    level: "Advanced",
    categories: [
      "動作 (Motion)",
      "控制 (Control)",
      "偵測 (Sensing)",
      "運算 (Operators)",
    ],
    categoriesEn: ["Motion", "Control", "Sensing", "Operators"],
    concepts: ["速度模擬", "重力", "巢狀邏輯迴圈"],
    conceptsEn: ["Fake speed with a variable", "Gravity", "If-then inside if-then"],
    description:
      "用速度變數模擬重力、跳躍與落地，做出橫向平台遊戲。",
    descriptionEn:
      "Use a speed variable to fake gravity, jump, and land in a side-scrolling platformer.",
    path: "/scratch/chapter/6",
    available: true,
    overview:
      "把重力、摩擦、動量轉成演算法。用變數更新做出跳躍、下落與地面碰撞。",
    overviewEn:
      "Turn gravity, friction, and momentum into steps. Update variables for jump, fall, and ground hits.",
    blocks: [
      "change [Y-Velocity] by (−1) 模擬重力",
      "巢狀 if-then 偵測地面後再允許跳躍",
      "change x by (X-Velocity) 左右加速",
    ],
    blocksEn: [
      "change [Y-Velocity] by (−1) to fake gravity",
      "Nested if-then: check the ground, then allow a jump",
      "change x by (X-Velocity) to speed left and right",
    ],
    activity: {
      name: "2D 平台遊戲",
      nameEn: "2D platformer",
      detail:
        "橫向關卡：奔跑、跳躍、躲障礙、過關旗幟；用速度公式而非單純 move steps。",
      detailEn:
        "A side-scrolling level: run, jump, dodge, reach the flag. Use speed numbers, not only move steps.",
    },
    outcomes: [
      "用變數狀態模擬物理系統",
      "除錯穿模、卡牆等碰撞問題",
      "把計算結果直接更新座標",
    ],
    outcomesEn: [
      "Fake physics with speed variables",
      "Fix bugs like going through floors or sticking in walls",
      "Use the math result to update x and y",
    ],
  },
  {
    id: 7,
    title: "模組化程式與自訂積木",
    titleEn: "Modular Programming & Custom Functions",
    level: "Advanced",
    categories: ["函式積木 (My Blocks)", "控制 (Control)"],
    categoriesEn: ["My Blocks", "Control"],
    concepts: ["程序抽象", "模組化", "程式重用", "DRY 原則"],
    conceptsEn: ["Pack steps behind a name", "Split code into pieces", "Reuse scripts", "DRY: don’t repeat yourself"],
    description:
      "把重複動作收成「我的積木」，用參數讓程式更乾淨好除錯。",
    descriptionEn:
      "Pack repeated actions into My Blocks, and use inputs so code is cleaner and easier to fix.",
    path: "/scratch/chapter/7",
    available: true,
    overview:
      "專案變大時，複製貼上會難維護。學習自訂積木與輸入參數，把複雜動作收成可重用程序。",
    overviewEn:
      "When a project grows, copy-paste is hard to keep. Learn custom blocks and inputs to pack big actions into reusable steps.",
    blocks: [
      "define [自訂積木名稱]",
      "為積木加入數字、文字、布林參數",
      "勾選「執行時不更新畫面」處理複雜多步驟",
    ],
    blocksEn: [
      "define [custom block name]",
      "Add number, text, or boolean inputs to the block",
      "Check “Run without screen refresh” for big multi-step work",
    ],
    activity: {
      name: "Boss 戰鬥框架",
      nameEn: "Boss battle toolkit",
      detail:
        "把旋轉攻擊、衝刺、階段重置等收成自訂積木，讓主遊戲迴圈保持簡潔。",
      detailEn:
        "Pack spin attack, dash, and phase reset into My Blocks so the main game loop stays short.",
    },
    compare: [
      "沒有我的積木：每個角色重複貼上移動程式 10 次",
      "有我的積木：定義 Jump (Height)(Speed) 一次，到處呼叫 Jump (10)(2)",
    ],
    compareEn: [
      "Without My Blocks: paste the same move script 10 times on every sprite",
      "With My Blocks: define Jump (Height)(Speed) once, then call Jump (10)(2) anywhere",
    ],
    outcomes: [
      "用程序抽象減少重複積木",
      "傳入參數動態調整行為",
      "把大型專案重構成清楚模組",
    ],
    outcomesEn: [
      "Use a named block instead of copying the same stack",
      "Pass inputs to change how the block acts",
      "Split a big project into clear pieces",
    ],
  },
];

export function getScratchChapterById(id) {
  return SCRATCH_CHAPTERS.find((ch) => ch.id === Number(id)) ?? null;
}
