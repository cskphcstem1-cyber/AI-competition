export const MATH_CURRICULUM_INTRO =
  "Arithmetic 課程依循由淺入深的原則，循序漸進地培養學生的數字感、邏輯推理與應用能力。";
export const MATH_CURRICULUM_INTRO_EN =
  "The Arithmetic course goes from easy to harder, and slowly builds number sense, logic, and problem solving.";

export const MATH_LEVEL_COUNT = 7;

const LESSON_TITLE_EN = {
  單元簡介: "Lesson intro",
  練習重點: "Practice",
  "順數、倒數與跳數": "Count forward, backward, and skip-count",
  單數與雙數: "Odd and even",
  比較大小與數線: "Compare size on a number line",
  拆數與合數: "Split and join numbers",
  模型與報讀: "Models and reading numbers",
  湊十與破十: "Make ten and break ten",
  文字裡的加減: "Add and subtract in word problems",
  直式要點: "Column method tips",
  估算與驗算: "Estimate and check",
  九九乘法表: "Times tables",
  直式一位數乘多位數: "One-digit times a bigger number",
  運算律: "Number laws",
  次方與倍數: "Powers and multiples",
  商與餘數: "Quotient and remainder",
  混合運算: "Mixed operations",
  "真、假、帶分數": "Proper, improper, and mixed numbers",
  分數運算入門: "Fraction operations",
  比較與加減: "Compare, add, and subtract",
  乘除與小數點: "Multiply, divide, and the decimal point",
  四捨五入: "Rounding",
  絕對值與相反數: "Absolute value and opposites",
  四則運算入門: "The four operations",
  移項與求解: "Move terms and solve",
};

/** extra may include paragraphsEn, tip, tipEn, example { q, a, qEn, aEn }, titleEn */
function L(id, title, paragraphs, extra = {}) {
  return {
    id,
    title,
    titleEn: extra.titleEn || LESSON_TITLE_EN[title],
    paragraphs,
    ...extra,
  };
}

/** Arithmetic levels 1–7 with clickable topic lessons (Python-style detail pages). */
export const MATH_LEVELS = [
  {
    level: 1,
    title: "基礎數概念",
    titleEn: "Number basics",
    grade: null,
    color: "from-teal-500 to-emerald-500",
    overview:
      "建立穩固的數字感：能認讀、數數、理解位值，並用生活情境描述數量。",
    overviewEn:
      "Build number sense: read numbers, count, understand place value, and talk about amounts in daily life.",
    topics: [
      {
        id: "read-count",
        name: "數字認讀與數數",
        nameEn: "Read and count numbers",
        summary: "認識 1～100、跳數、單雙數，並在數線上讀寫與比較。",
        summaryEn: "Know 1–100, skip-count, odd and even, and read numbers on a line.",
        points: [
          "認識、讀寫 1 至 100 的整數",
          "順數、倒數與跳數（如 2、5、10）",
          "認識位值：個位與十位",
          "分辨單數與雙數",
          "在數線上標示與讀出指定數字",
          "比較兩數大小（大於、小於、等於）",
          "認識「幾組」「幾個」等數量語詞",
          "用實物、圖點與數字互相對應",
        ],
        pointsEn: [
          "Read and write whole numbers from 1 to 100",
          "Count forward, backward, and skip-count (like 2, 5, 10)",
          "Know place value: ones and tens",
          "Tell odd numbers from even numbers",
          "Mark and read numbers on a number line",
          "Compare two numbers (greater than, less than, equal)",
          "Know words like “groups” and “how many”",
          "Match objects, dots, and numbers",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "數字是描述「有多少」的工具。本單元要能正確讀、寫 1 到 100 的整數，並用順數、倒數、跳數建立數感。",
            "也會練習在數線上找數字、比較大小，以及分辨單數與雙數。",
          ], {
            paragraphsEn: [
              "Numbers tell us “how many.” In this lesson you will read and write whole numbers from 1 to 100, and count forward, backward, and by skips to build number sense.",
              "You will also find numbers on a number line, compare size, and tell odd from even.",
            ],
          }),
          L("count", "順數、倒數與跳數", [
            "順數：由小到大，例如 7、8、9、10。",
            "倒數：由大到小，例如 10、9、8、7。",
            "跳數：每次加固定數量。以 2 跳：2、4、6、8；以 5 跳：5、10、15、20；以 10 跳：10、20、30。",
          ], {
            paragraphsEn: [
              "Count forward: from small to big, like 7, 8, 9, 10.",
              "Count backward: from big to small, like 10, 9, 8, 7.",
              "Skip-count: add the same amount each time. By 2: 2, 4, 6, 8. By 5: 5, 10, 15, 20. By 10: 10, 20, 30.",
            ],
            tip: "跳數時先想「每次加幾」，再往後數，較不容易漏數。",
            tipEn: "When you skip-count, first think “add how many each time,” then count on so you don’t skip a number.",
            example: {
              q: "從 12 開始以 2 跳三步，下一個是？",
              a: "14、16、18",
              qEn: "Start at 12 and skip-count by 2 three times. What comes next?",
              aEn: "14, 16, 18",
            },
          }),
          L("odd-even", "單數與雙數", [
            "雙數：能平均分成兩份的整數，個位是 0、2、4、6、8。",
            "單數：個位是 1、3、5、7、9。",
            "例如 24 是雙數，37 是單數。",
          ], {
            paragraphsEn: [
              "Even numbers can be split into two equal groups. The ones digit is 0, 2, 4, 6, or 8.",
              "Odd numbers have a ones digit of 1, 3, 5, 7, or 9.",
              "For example, 24 is even and 37 is odd.",
            ],
          }),
          L("compare", "比較大小與數線", [
            "在數線上，右邊的數比較大。",
            "比較兩數時可先看十位，十位相同再看個位。",
            "符號：> 大於、< 小於、＝ 等於、≠ 不等於、≥ 大於或等於、≤ 小於或等於。",
          ], {
            paragraphsEn: [
              "On a number line, numbers to the right are bigger.",
              "To compare two numbers, look at the tens first. If tens are the same, look at the ones.",
              "Symbols: > greater than, < less than, ＝ equal, ≠ not equal, ≥ greater than or equal, ≤ less than or equal.",
            ],
            example: {
              q: "45 與 54，哪個較大？",
              a: "54 較大（十位 5 > 4）",
              qEn: "Which is bigger, 45 or 54?",
              aEn: "54 is bigger (tens: 5 > 4)",
            },
          }),
        ],
      },
      {
        id: "place-value",
        name: "位值與組成",
        nameEn: "Place value",
        summary: "把兩位數拆成「幾個十 + 幾個一」，用模型理解位值。",
        summaryEn: "Split a two-digit number into tens and ones. Use models for place value.",
        points: [
          "把兩位數拆成「幾個十 + 幾個一」",
          "認識 10 個一是 1 個十、10 個十是 1 個百（預備）",
          "用積木／錢幣模型表示兩位數",
          "聽寫與報讀兩位數（如三十七）",
        ],
        pointsEn: [
          "Split a two-digit number into “how many tens + how many ones”",
          "Know that 10 ones make 1 ten, and 10 tens make 1 hundred (preview)",
          "Show two-digit numbers with blocks or coins",
          "Hear, write, and say two-digit numbers (like thirty-seven)",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "位值告訴我們同一個數字在不同位置代表不同大小。例如 37 中的 3 是 3 個十（30），7 是 7 個一。",
          ], {
            paragraphsEn: [
              "Place value tells us that the same digit can mean different amounts in different places. In 37, the 3 is 3 tens (30), and the 7 is 7 ones.",
            ],
          }),
          L("decompose", "拆數與合數", [
            "37 = 3 個十 + 7 個一 = 30 + 7。",
            "50 = 5 個十 + 0 個一。",
            "合起來：20 + 8 = 28。",
          ], {
            paragraphsEn: [
              "37 = 3 tens + 7 ones = 30 + 7.",
              "50 = 5 tens + 0 ones.",
              "Join them: 20 + 8 = 28.",
            ],
            tip: "寫直式加減前，先對齊個位與十位，就是在用位值。",
            tipEn: "Before you add or subtract in columns, line up the ones and tens. That is using place value.",
            example: {
              q: "48 是幾個十、幾個一？",
              a: "4 個十、8 個一",
              qEn: "How many tens and ones are in 48?",
              aEn: "4 tens and 8 ones",
            },
          }),
          L("model", "模型與報讀", [
            "可用十元、一元硬幣：4 個十元 + 2 個一元 = 42。",
            "報讀：42 讀作「四十二」；注意 12 讀「十二」不是「一十二」（口語習慣）。",
          ], {
            paragraphsEn: [
              "You can use $10 and $1 coins: 4 tens + 2 ones = 42.",
              "Say it: 42 is “forty-two.” Note that 12 is “twelve,” not “one-twelve.”",
            ],
          }),
          L("practice", "練習重點", [
            "把 56、70、19 拆成十與一。",
            "用積木排出 35，再說出各是幾個十、幾個一。",
          ], {
            paragraphsEn: [
              "Split 56, 70, and 19 into tens and ones.",
              "Build 35 with blocks, then say how many tens and how many ones.",
            ],
          }),
        ],
      },
    ],
  },
  {
    level: 2,
    title: "加減概念",
    titleEn: "Addition and subtraction",
    grade: null,
    color: "from-sky-500 to-cyan-500",
    overview:
      "理解加減的意義，熟練心算與直式，並能驗算、估算與解簡單文字題。",
    overviewEn:
      "Understand plus and minus, practice mental and column methods, and check, estimate, and solve simple word problems.",
    topics: [
      {
        id: "add-sub-basic",
        name: "基礎加減法",
        nameEn: "Basic plus and minus",
        summary: "20 以內心算，100 以內進位／退位加減，理解加減語意。",
        summaryEn: "Mental +/− within 20, carrying and borrowing within 100, and the meaning of plus and minus.",
        points: [
          "20 以內的加減法（心算與直式）",
          "100 以內不進位、進位加法",
          "100 以內不退位、退位減法",
          "認識加減互為逆運算",
          "湊十法、破十法與數線輔助",
        ],
        pointsEn: [
          "Add and subtract within 20 (mental math and columns)",
          "Add within 100 with and without carrying",
          "Subtract within 100 with and without borrowing",
          "Know that plus and minus undo each other",
          "Use make-ten, break-ten, and a number line",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "加法是合起來或往前數；減法是拿走、比較差或往後數。兩者互為逆運算：8＋5＝13，則 13−5＝8。",
          ], {
            paragraphsEn: [
              "Addition is putting together or counting on. Subtraction is taking away, finding the difference, or counting back. They undo each other: 8＋5＝13, so 13−5＝8.",
            ],
          }),
          L("strategies", "湊十與破十", [
            "湊十：8＋5 → 8＋2＝10，再＋3＝13。",
            "破十：13−5 → 13−3＝10，再−2＝8。",
            "數線：從起點依運算方向移動。",
          ], {
            paragraphsEn: [
              "Make ten: 8＋5 → 8＋2＝10, then ＋3＝13.",
              "Break ten: 13−5 → 13−3＝10, then −2＝8.",
              "Number line: start at a number and move the way the operation says.",
            ],
            tip: "進位加法：個位相加滿 10，向前一位進 1。",
            tipEn: "When adding with carrying: if ones add up to 10 or more, write the ones and carry 1 to the tens.",
            example: {
              q: "47＋28＝？",
              a: "75（個位 7＋8＝15，寫 5 進 1；十位 4＋2＋1＝7）",
              qEn: "47＋28＝?",
              aEn: "75 (ones: 7＋8＝15, write 5 carry 1; tens: 4＋2＋1＝7)",
            },
          }),
          L("meaning", "文字裡的加減", [
            "合起來、一共、總共 → 常是加法。",
            "拿走、剩下、少了 → 常是減法。",
            "甲比乙多／少 → 常用減法求差。",
          ], {
            paragraphsEn: [
              "Words like “put together,” “in all,” or “total” often mean addition.",
              "Words like “take away,” “left,” or “fewer” often mean subtraction.",
              "“How many more / how many fewer” often uses subtraction to find the difference.",
            ],
          }),
          L("practice", "練習重點", [
            "完成 20 以內心算 10 題。",
            "各做 5 題進位加、退位減並驗算。",
          ], {
            paragraphsEn: [
              "Do 10 mental +/− questions within 20.",
              "Do 5 carrying-add and 5 borrowing-subtract questions, then check.",
            ],
          }),
        ],
      },
      {
        id: "multi-digit",
        name: "多位數運算",
        nameEn: "Bigger numbers",
        summary: "三位數位值、直式加減、混合題與估算驗算。",
        summaryEn: "Three-digit place value, column +/−, mixed questions, estimate and check.",
        points: [
          "三位數的讀寫與位值（百位）",
          "三位數直式加法與減法",
          "加減混合運算（兩至三步）",
          "估算與驗算加減結果",
          "進位／退位時對齊個十百位",
          "認識 0 在加減中的角色",
        ],
        pointsEn: [
          "Read, write, and know place value for three-digit numbers (hundreds)",
          "Add and subtract three-digit numbers in columns",
          "Mixed +/− with two or three steps",
          "Estimate and check +/− answers",
          "Line up ones, tens, and hundreds when carrying or borrowing",
          "Know what 0 does in + and −",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "進入百位後，直式要對齊個、十、百。0 很重要：305 的 0 表示十位上一個都沒有。",
          ], {
            paragraphsEn: [
              "Once you use hundreds, line up ones, tens, and hundreds in columns. 0 matters: in 305, the 0 means there are no tens.",
            ],
          }),
          L("column", "直式要點", [
            "由右向左算：先個位，再十位、百位。",
            "減法不夠減時向左借 1（退位）。",
            "混合運算依序計算，有括號先算括號內。",
          ], {
            paragraphsEn: [
              "Work from right to left: ones first, then tens, then hundreds.",
              "If you cannot subtract, borrow 1 from the left (regroup).",
              "In mixed steps, go in order. If there are brackets, do the brackets first.",
            ],
            example: {
              q: "503−178＝？",
              a: "325（注意向百位借位）",
              qEn: "503−178＝?",
              aEn: "325 (remember to borrow from the hundreds)",
            },
          }),
          L("estimate", "估算與驗算", [
            "估算：四捨五入到百位再加減，檢查答案是否接近。",
            "驗算：加法可用減法檢查；減法可用加法還原。",
          ], {
            paragraphsEn: [
              "Estimate: round to the nearest hundred, then add or subtract to see if your answer is close.",
              "Check: use subtraction to check addition; use addition to check subtraction.",
            ],
          }),
          L("practice", "練習重點", [
            "直式計算 346＋287、600−245。",
            "計算 (120＋35)−40 並說明步驟。",
          ], {
            paragraphsEn: [
              "Use columns to compute 346＋287 and 600−245.",
              "Compute (120＋35)−40 and say each step.",
            ],
          }),
        ],
      },
    ],
  },
  {
    level: 3,
    title: "乘法與次方概念",
    titleEn: "Multiplication and powers",
    grade: null,
    color: "from-cyan-500 to-blue-500",
    overview:
      "從「相同數量累加」建立乘法，熟練九九表，再延伸到直式乘法與次方。",
    overviewEn:
      "See multiplication as adding the same amount again and again. Learn times tables, column multiply, and powers.",
    topics: [
      {
        id: "multiply-concept",
        name: "乘法概念",
        nameEn: "What multiplication means",
        summary: "乘法意義、九九表、一位數乘多位數。",
        summaryEn: "What × means, times tables, and 1-digit times a bigger number.",
        points: [
          "理解乘法是「相同數量的累加」",
          "熟練九九乘法表",
          "一位數乘多位數的直式乘法",
          "用陣列圖、面積模型理解乘法",
          "認識乘數、被乘數與積",
          "乘法與跳數的連結",
        ],
        pointsEn: [
          "See multiplication as adding the same amount again and again",
          "Know the times tables well",
          "Multiply a bigger number by a 1-digit number in columns",
          "Use arrays and area models to see multiplication",
          "Know multiplier, multiplicand, and product",
          "Connect multiplication to skip-counting",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "3×4 表示 4＋4＋4（3 個 4）或 3＋3＋3＋3（4 個 3）。積是乘法的結果。",
          ], {
            paragraphsEn: [
              "3×4 means 4＋4＋4 (three 4s) or 3＋3＋3＋3 (four 3s). The product is the answer to a multiplication.",
            ],
          }),
          L("table", "九九乘法表", [
            "背誦 1～9 的乘法表，並理解每一格的意義。",
            "交換律：4×7＝7×4，可減少記憶負擔。",
          ], {
            paragraphsEn: [
              "Learn the 1–9 times tables and know what each fact means.",
              "Commutative law: 4×7＝7×4, so you have fewer facts to remember.",
            ],
            tip: "不會背時，用跳數或已知事實推導（如 6×8＝5×8＋8）。",
            tipEn: "If you forget a fact, skip-count or build from one you know (like 6×8＝5×8＋8).",
            example: { q: "6×7＝？", a: "42", qEn: "6×7＝?", aEn: "42" },
          }),
          L("column-mul", "直式一位數乘多位數", [
            "由個位乘起，滿十進位。",
            "例如 23×4：先 3×4＝12，寫 2 進 1；再 2×4＋1＝9，得 92。",
          ], {
            paragraphsEn: [
              "Start with the ones. If you get 10 or more, carry.",
              "Example 23×4: first 3×4＝12, write 2 carry 1; then 2×4＋1＝9, so the product is 92.",
            ],
          }),
          L("practice", "練習重點", [
            "默寫 7 的乘法表。",
            "計算 45×6、108×3。",
          ], {
            paragraphsEn: [
              "Write the 7 times table from memory.",
              "Compute 45×6 and 108×3.",
            ],
          }),
        ],
      },
      {
        id: "multiply-advanced",
        name: "進階乘法",
        nameEn: "Harder multiplication",
        summary: "多位數相乘、運算律與估算。",
        summaryEn: "Multiply bigger numbers, number laws, and estimate.",
        points: [
          "多位數乘多位數的直式乘法",
          "乘法的交換律、結合律與分配律",
          "末位有 0 的快捷算法（如 ×10、×100）",
          "估算乘積的大約範圍",
          "含括號的乘法算式",
        ],
        pointsEn: [
          "Multiply bigger numbers in columns",
          "Use commutative, associative, and distributive laws",
          "Fast ways when a number ends in 0 (like ×10, ×100)",
          "Estimate about how big the product is",
          "Multiplication with brackets",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "多位數相乘時，第二列起要記得「向左錯一位」（乘的是十位）。",
          ], {
            paragraphsEn: [
              "When you multiply bigger numbers, shift the next row one place left (because you are multiplying by tens).",
            ],
          }),
          L("laws", "運算律", [
            "交換律：a×b＝b×a。",
            "結合律：(a×b)×c＝a×(b×c)。",
            "分配律：a×(b＋c)＝a×b＋a×c，可拆開速算。",
          ], {
            paragraphsEn: [
              "Commutative law: a×b＝b×a.",
              "Associative law: (a×b)×c＝a×(b×c).",
              "Distributive law: a×(b＋c)＝a×b＋a×c. You can split a number to multiply faster.",
            ],
            example: {
              q: "15×12＝15×(10＋2)＝？",
              a: "150＋30＝180",
              qEn: "15×12＝15×(10＋2)＝?",
              aEn: "150＋30＝180",
            },
          }),
          L("practice", "練習重點", [
            "直式計算 24×36。",
            "用分配律算 25×16。",
          ], {
            paragraphsEn: [
              "Use columns to compute 24×36.",
              "Use the distributive law to compute 25×16.",
            ],
          }),
        ],
      },
      {
        id: "powers",
        name: "次方（Power）",
        nameEn: "Powers",
        summary: "次方意義、簡單計算與和乘法的差別。",
        summaryEn: "What a power means, simple powers, and how they differ from multiply.",
        points: [
          "認識次方的意義（如 2³）",
          "計算簡單整數的次方",
          "含次方的簡單算式",
          "分辨 a² 與 2a、a×a 的關係",
          "認識 10 的次方與位值（百、千）的連結",
        ],
        pointsEn: [
          "Know what a power means (like 2³)",
          "Compute simple powers of whole numbers",
          "Simple expressions that include powers",
          "Tell a² apart from 2a, and how a² relates to a×a",
          "Connect powers of 10 to place value (hundreds, thousands)",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "aⁿ 表示 n 個 a 相乘。2³＝2×2×2＝8。注意 2³ 不是 2×3。",
          ], {
            paragraphsEn: [
              "aⁿ means n copies of a multiplied together. 2³＝2×2×2＝8. Note: 2³ is not 2×3.",
            ],
          }),
          L("compare", "次方與倍數", [
            "a²＝a×a；2a＝a＋a（或 2×a）。",
            "10²＝100，10³＝1000，連結百位、千位。",
          ], {
            paragraphsEn: [
              "a²＝a×a; 2a＝a＋a (or 2×a).",
              "10²＝100 and 10³＝1000. That links to hundreds and thousands.",
            ],
            example: {
              q: "3² 與 2×3 哪個大？",
              a: "3²＝9，2×3＝6，所以 3² 較大",
              qEn: "Which is bigger, 3² or 2×3?",
              aEn: "3²＝9 and 2×3＝6, so 3² is bigger",
            },
          }),
          L("practice", "練習重點", [
            "算 2⁴、5²、10³。",
            "寫出 4³ 的展開乘法再求值。",
          ], {
            paragraphsEn: [
              "Compute 2⁴, 5², and 10³.",
              "Write 4³ as a multiplication, then find the value.",
            ],
          }),
        ],
      },
      {
        id: "mul-apply",
        name: "應用題",
        nameEn: "Word problems",
        summary: "等量累加的情境列式。",
        summaryEn: "Write number sentences for equal groups.",
        points: [
          "等量累加的生活情境（盒數、排數）",
          "由乘法列式並驗算",
        ],
        pointsEn: [
          "Equal-group stories (boxes, rows)",
          "Write a multiplication sentence and check",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "每盒 6 顆，5 盒一共？→ 6×5。先列式再計算，最後用加法驗算也可。",
          ], {
            paragraphsEn: [
              "6 in each box, 5 boxes in all? → 6×5. Write the sentence first, then compute. You can also check with addition.",
            ],
          }),
          L("practice", "練習重點", [
            "教室有 8 排，每排 5 張椅子，共幾張？列式作答。",
          ], {
            paragraphsEn: [
              "A classroom has 8 rows with 5 chairs in each row. How many chairs? Write a number sentence and answer.",
            ],
          }),
        ],
      },
    ],
  },
  {
    level: 4,
    title: "除法概念",
    titleEn: "Division",
    grade: null,
    color: "from-blue-500 to-indigo-500",
    overview:
      "掌握平均分與包含除，處理餘數，並進入分數的認識與四則運算。",
    overviewEn:
      "Learn sharing and grouping division, remainders, then fractions and the four operations with them.",
    topics: [
      {
        id: "division",
        name: "除法",
        nameEn: "Division",
        summary: "平均分、包含除、餘數與四則混合。",
        summaryEn: "Sharing, grouping, remainders, and mixed + − × ÷.",
        points: [
          "理解除法是「平均分」與「包含除」",
          "整除與有餘數的除法",
          "加減乘除的簡單混合題（含括號）",
          "認識除數、被除數、商與餘數",
          "除法與乘法的逆運算關係",
          "一位數除多位數的直式除法",
          "餘數必須小於除數",
        ],
        pointsEn: [
          "See division as sharing equally and as grouping",
          "Division that comes out even, and division with a remainder",
          "Simple mixed + − × ÷ (with brackets)",
          "Know divisor, dividend, quotient, and remainder",
          "Know that division undoes multiplication",
          "Divide a bigger number by a 1-digit number in columns",
          "The remainder must be smaller than the divisor",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "平均分：12 顆糖分給 3 人，每人幾個？包含除：12 顆糖每 3 顆一袋，可裝幾袋？",
          ], {
            paragraphsEn: [
              "Sharing: 12 sweets for 3 people, how many each? Grouping: 12 sweets, 3 in each bag, how many bags?",
            ],
          }),
          L("remainder", "商與餘數", [
            "17÷5＝3……2，表示商 3、餘數 2。",
            "餘數一定小於除數。可用乘法驗算：商×除數＋餘數＝被除數。",
          ], {
            paragraphsEn: [
              "17÷5＝3……2 means quotient 3 and remainder 2.",
              "The remainder must be smaller than the divisor. Check with multiplication: quotient × divisor ＋ remainder ＝ dividend.",
            ],
            example: {
              q: "23÷4＝？",
              a: "5……3，因為 5×4＋3＝23",
              qEn: "23÷4＝?",
              aEn: "5……3, because 5×4＋3＝23",
            },
          }),
          L("order", "混合運算", [
            "先乘除後加減；有括號先算括號內。",
            "除法是乘法的逆運算：36÷6＝6 因 6×6＝36。",
          ], {
            paragraphsEn: [
              "Do × and ÷ before ＋ and −. If there are brackets, do the brackets first.",
              "Division undoes multiplication: 36÷6＝6 because 6×6＝36.",
            ],
          }),
          L("practice", "練習重點", [
            "直式計算 84÷7、100÷8。",
            "算 (5＋7)×2−6。",
          ], {
            paragraphsEn: [
              "Use columns to compute 84÷7 and 100÷8.",
              "Compute (5＋7)×2−6.",
            ],
          }),
        ],
      },
      {
        id: "fractions",
        name: "分數概念",
        nameEn: "Fractions",
        summary: "分數意義、真假帶分數、比較與四則。",
        summaryEn: "What fractions mean, proper/improper/mixed, compare, and compute.",
        points: [
          "認識分數的意義",
          "認識假分數、真分數與帶分數",
          "分數的比較大小",
          "分數的加法與減法",
          "分數的乘法與除法",
          "認識分子、分母與單位分數",
          "分數與除法、小數的初步連結",
          "約分與擴分的基本觀念",
        ],
        pointsEn: [
          "Know what a fraction means",
          "Know improper, proper, and mixed numbers",
          "Compare fractions",
          "Add and subtract fractions",
          "Multiply and divide fractions",
          "Know numerator, denominator, and unit fractions",
          "Link fractions to division and decimals",
          "Basic ideas of simplifying and expanding fractions",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "分數 a/b 表示把整份分成 b 等份，取 a 份。b 是分母，a 是分子。",
          ], {
            paragraphsEn: [
              "The fraction a/b means split a whole into b equal parts and take a parts. b is the denominator and a is the numerator.",
            ],
          }),
          L("types", "真、假、帶分數", [
            "真分數：分子 < 分母，如 3/4。",
            "假分數：分子 ≥ 分母，如 5/4。",
            "帶分數：整數＋真分數，如 1 又 1/4。",
          ], {
            paragraphsEn: [
              "Proper fraction: numerator < denominator, like 3/4.",
              "Improper fraction: numerator ≥ denominator, like 5/4.",
              "Mixed number: a whole number ＋ a proper fraction, like 1 and 1/4.",
            ],
          }),
          L("ops", "分數運算入門", [
            "同分母加減：分子相加減，分母不變。",
            "異分母要先通分。乘法：分子乘分子、分母乘分母。",
            "除以分數＝乘以倒數。",
          ], {
            paragraphsEn: [
              "Same denominator ＋/−: add or subtract the numerators. The denominator stays the same.",
              "Different denominators: first make them the same. Multiply: numerator × numerator, denominator × denominator.",
              "Divide by a fraction ＝ multiply by its reciprocal.",
            ],
            tip: "約分可讓分數更簡單；擴分用於通分。",
            tipEn: "Simplifying makes a fraction simpler. Expanding is used when you need a common denominator.",
            example: {
              q: "1/2＋1/4＝？",
              a: "2/4＋1/4＝3/4",
              qEn: "1/2＋1/4＝?",
              aEn: "2/4＋1/4＝3/4",
            },
          }),
          L("practice", "練習重點", [
            "比較 2/5 與 3/5、1/2 與 2/3。",
            "計算 2/3×3/4。",
          ], {
            paragraphsEn: [
              "Compare 2/5 with 3/5, and 1/2 with 2/3.",
              "Compute 2/3×3/4.",
            ],
          }),
        ],
      },
      {
        id: "div-frac-apply",
        name: "混合與應用",
        nameEn: "Mix and apply",
        summary: "除法與分數的生活情境題。",
        summaryEn: "Division and fraction word problems.",
        points: [
          "「平均分給幾人」「每份幾個」文字題",
          "含餘數情境的說明（還剩幾個）",
          "分數在食譜、時間、圖形分割中的應用",
        ],
        pointsEn: [
          "Word problems about sharing and “how many in each group”",
          "Stories with remainders (how many are left)",
          "Fractions in recipes, time, and splitting shapes",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "把餘數說清楚：25 本借給每組 6 本，可分幾組？剩幾本？",
          ], {
            paragraphsEn: [
              "Say the remainder clearly: 25 books, 6 for each group. How many groups? How many books left?",
            ],
          }),
          L("practice", "練習重點", [
            "披薩切成 8 等份，吃了 3 份，剩下用分數表示。",
          ], {
            paragraphsEn: [
              "A pizza is cut into 8 equal slices. You eat 3 slices. Write the leftover as a fraction.",
            ],
          }),
        ],
      },
    ],
  },
  {
    level: 5,
    title: "小數概念",
    titleEn: "Decimals",
    grade: null,
    color: "from-indigo-500 to-violet-500",
    overview:
      "理解小數與位值（十分位、百分位），熟練小數四則，並能與分數互換。",
    overviewEn:
      "Understand decimals and place value (tenths, hundredths), compute with decimals, and swap them with fractions.",
    topics: [
      {
        id: "decimals",
        name: "小數概念",
        nameEn: "Decimals",
        summary: "讀寫、比較、四則與位值、分數互換。",
        summaryEn: "Read, compare, compute decimals, place value, and fraction swaps.",
        points: [
          "小數的讀取",
          "小數的比較大小",
          "小數的加法與減法",
          "小數的乘法與除法",
          "認識十分位、百分位與千分位",
          "小數與分數的互換（如 0.5＝1/2）",
          "直式小數加減：對齊小數點",
          "小數乘 10、100 時小數點的移動",
        ],
        pointsEn: [
          "Read decimals",
          "Compare decimals",
          "Add and subtract decimals",
          "Multiply and divide decimals",
          "Know tenths, hundredths, and thousandths",
          "Swap decimals and fractions (like 0.5＝1/2)",
          "Add and subtract decimals in columns: line up the decimal points",
          "Move the decimal point when multiplying by 10 or 100",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "小數點右邊第一位是十分位，再來是百分位。0.3＝3/10，0.25＝25/100＝1/4。",
          ], {
            paragraphsEn: [
              "The first place after the decimal point is tenths, then hundredths. 0.3＝3/10, and 0.25＝25/100＝1/4.",
            ],
          }),
          L("compare-add", "比較與加減", [
            "比較時從高位比到低位；可先補 0 使小數位相同（1.5 與 1.50 相等）。",
            "直式加減一定對齊小數點。",
          ], {
            paragraphsEn: [
              "Compare from the highest place to the lowest. You can add extra 0s so the decimal places match (1.5 equals 1.50).",
              "In columns, always line up the decimal points.",
            ],
            example: {
              q: "1.25＋0.8＝？",
              a: "2.05",
              qEn: "1.25＋0.8＝?",
              aEn: "2.05",
            },
          }),
          L("mul-div", "乘除與小數點", [
            "×10 小數點右移 1 位；÷10 左移 1 位。",
            "小數乘法可先當整數乘，再數小數位數決定小數點位置。",
          ], {
            paragraphsEn: [
              "×10 moves the decimal point 1 place right; ÷10 moves it 1 place left.",
              "To multiply decimals, you can multiply as whole numbers first, then count decimal places to put the point.",
            ],
          }),
          L("practice", "練習重點", [
            "讀出 3.08、比較 0.7 與 0.65。",
            "計算 2.5×4、6.3÷3。",
          ], {
            paragraphsEn: [
              "Read 3.08. Compare 0.7 and 0.65.",
              "Compute 2.5×4 and 6.3÷3.",
            ],
          }),
        ],
      },
      {
        id: "decimal-apply",
        name: "估算與應用",
        nameEn: "Estimate and apply",
        summary: "金錢長度、四捨五入與合理性檢查。",
        summaryEn: "Money and length, rounding, and “does this answer make sense?”",
        points: [
          "金額、長度、體重等小數情境",
          "四捨五入到指定小數位",
          "檢查小數運算結果是否合理",
          "小數與整數、分數的大小比較",
        ],
        pointsEn: [
          "Decimal stories with money, length, and weight",
          "Round to a given decimal place",
          "Check if a decimal answer makes sense",
          "Compare decimals with whole numbers and fractions",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "價錢 $12.50、身高 1.35 m 都是小數。四捨五入可幫助估算。",
          ], {
            paragraphsEn: [
              "A price of $12.50 and a height of 1.35 m are decimals. Rounding helps you estimate.",
            ],
          }),
          L("round", "四捨五入", [
            "看下一位：≥5 進上去，＜5 捨去。",
            "1.26 到十分位是 1.3；1.24 到十分位是 1.2。",
          ], {
            paragraphsEn: [
              "Look at the next digit: ≥5 round up, ＜5 round down.",
              "1.26 to the nearest tenth is 1.3; 1.24 to the nearest tenth is 1.2.",
            ],
          }),
          L("practice", "練習重點", [
            "把 2.718 四捨五入到百分位。",
            "估計 19.8＋3.2 約等於多少。",
          ], {
            paragraphsEn: [
              "Round 2.718 to the nearest hundredth.",
              "Estimate about what 19.8＋3.2 is.",
            ],
          }),
        ],
      },
      {
        id: "decimal-advanced",
        name: "進階技巧",
        nameEn: "Extra skills",
        summary: "小數除法、循環小數觀察、混合運算。",
        summaryEn: "Decimal division, repeating decimals, and mixed steps.",
        points: [
          "小數除法中商的小數位",
          "循環小數的初步認識（觀察）",
          "含小數的簡易混合運算",
        ],
        pointsEn: [
          "Decimal places in the quotient when dividing decimals",
          "A first look at repeating decimals (spot the pattern)",
          "Simple mixed operations with decimals",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "1÷3＝0.333… 是循環小數。先觀察規律，再學如何表示。",
          ], {
            paragraphsEn: [
              "1÷3＝0.333… is a repeating decimal. First spot the pattern, then learn how to write it.",
            ],
          }),
          L("practice", "練習重點", [
            "計算 1.2＋0.5×2（注意先乘後加）。",
          ], {
            paragraphsEn: [
              "Compute 1.2＋0.5×2 (remember × before ＋).",
            ],
          }),
        ],
      },
    ],
  },
  {
    level: 6,
    title: "正負數概念",
    titleEn: "Positive and negative numbers",
    grade: null,
    color: "from-fuchsia-500 to-pink-500",
    overview:
      "在數線與生活情境中建立正負數觀念，並完成正負數的四則運算。",
    overviewEn:
      "Build positive and negative numbers on a number line and in real life, then add, subtract, multiply, and divide them.",
    topics: [
      {
        id: "integers",
        name: "正負數概念",
        nameEn: "Positive and negative numbers",
        summary: "正負零、數線、四則與比較、絕對值。",
        summaryEn: "Positive, negative, zero, number line, four operations, absolute value.",
        points: [
          "認識正數、負數與零（+ / − numbers）",
          "在數線上表示正負數",
          "正負數的加法與減法",
          "正負數的乘法與除法",
          "比較正負數的大小",
          "認識絕對值的基本意義｜a｜",
          "相反數：a 與 −a",
          "溫度、樓層、盈虧等生活例子",
        ],
        pointsEn: [
          "Know positive numbers, negative numbers, and zero (+ / − numbers)",
          "Show positive and negative numbers on a number line",
          "Add and subtract positive and negative numbers",
          "Multiply and divide positive and negative numbers",
          "Compare positive and negative numbers",
          "Know the basic meaning of absolute value ｜a｜",
          "Opposites: a and −a",
          "Real-life examples: temperature, floors, gain and loss",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "零的右邊是正數，左邊是負數。−3 在數線上比 −1 更左，所以 −3＜−1。",
          ], {
            paragraphsEn: [
              "To the right of zero are positive numbers; to the left are negative numbers. −3 is farther left than −1, so −3＜−1.",
            ],
          }),
          L("abs", "絕對值與相反數", [
            "｜−5｜＝5，｜5｜＝5（到 0 的距離）。",
            "5 的相反數是 −5；−5 的相反數是 5。",
          ], {
            paragraphsEn: [
              "｜−5｜＝5 and ｜5｜＝5 (distance from 0).",
              "The opposite of 5 is −5; the opposite of −5 is 5.",
            ],
          }),
          L("ops", "四則運算入門", [
            "同號相乘為正，異號相乘為負。",
            "加一個負數＝減去它的相反數，例如 3＋(−5)＝3−5＝−2。",
          ], {
            paragraphsEn: [
              "Same signs multiply to a positive. Different signs multiply to a negative.",
              "Adding a negative is the same as subtracting its opposite. Example: 3＋(−5)＝3−5＝−2.",
            ],
            example: {
              q: "(−3)×(−4)＝？",
              a: "12",
              qEn: "(−3)×(−4)＝?",
              aEn: "12",
            },
          }),
          L("practice", "練習重點", [
            "在數線標出 −4、0、3。",
            "計算 (−2)＋7、(-6)÷2。",
          ], {
            paragraphsEn: [
              "Mark −4, 0, and 3 on a number line.",
              "Compute (−2)＋7 and (−6)÷2.",
            ],
          }),
        ],
      },
      {
        id: "integer-rules",
        name: "運算規則",
        nameEn: "Operation rules",
        summary: "同號異號、括號與數線移動。",
        summaryEn: "Same sign vs different sign, brackets, and moves on a number line.",
        points: [
          "同號相加、異號相減的直觀理解",
          "負負得正、異號相乘為負",
          "含括號的正負數算式",
          "數線上移動：加往右、減往左（直觀）",
        ],
        pointsEn: [
          "A picture of adding same signs and subtracting different signs",
          "Negative × negative is positive; different signs multiply to negative",
          "Positive and negative numbers with brackets",
          "Moves on a number line: add goes right, subtract goes left (picture)",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "把加減想成在數線上走路：加正數往右，加負數往左。",
          ], {
            paragraphsEn: [
              "Think of ＋ and − as walking on a number line: add a positive and go right; add a negative and go left.",
            ],
          }),
          L("practice", "練習重點", [
            "化簡 5−(−3) 與 (−4)−2。",
          ], {
            paragraphsEn: [
              "Simplify 5−(−3) and (−4)−2.",
            ],
          }),
        ],
      },
      {
        id: "integer-apply",
        name: "應用題",
        nameEn: "Word problems",
        summary: "溫度、海拔與帳目。",
        summaryEn: "Temperature, height, and money in/out.",
        points: [
          "溫度升降、海拔高低的計算",
          "簡易帳目：收入與支出",
          "判斷運算結果的正負號是否合理",
        ],
        pointsEn: [
          "Temperature up and down, and height above or below sea level",
          "Simple money in and money out",
          "Check if the ＋ or − sign of the answer makes sense",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "早上 −2°C，上升 5°C 後是 3°C。支出可用負數表示。",
          ], {
            paragraphsEn: [
              "Morning is −2°C. After it rises 5°C, it is 3°C. Spending money can be shown as a negative number.",
            ],
          }),
          L("practice", "練習重點", [
            "帳戶原有 100 元，支出 130 元，餘額用正負數表示。",
          ], {
            paragraphsEn: [
              "An account starts with 100. You spend 130. Write the balance as a positive or negative number.",
            ],
          }),
        ],
      },
    ],
  },
  {
    level: 7,
    title: "一元一次方程式",
    titleEn: "Linear equations",
    grade: null,
    color: "from-rose-500 to-orange-400",
    overview:
      "用未知數表示關係，學習移項與合併同類項，解出一元一次方程式並驗算。",
    overviewEn:
      "Use an unknown to show a relation. Move terms, combine like terms, solve a one-unknown equation, and check.",
    topics: [
      {
        id: "linear-eq",
        name: "一元一次方程式",
        nameEn: "Linear equations",
        summary: "未知數、移項、合併同類項與檢驗。",
        summaryEn: "Unknowns, moving terms, combining like terms, and checking.",
        points: [
          "認識未知數 x 的意義",
          "解簡易一元一次方程式",
          "用代入法檢驗答案",
          "認識等式的性質（兩邊同加、同乘）",
          "移項：變號的概念",
          "合併同類項（如 2x＋3x）",
          "把文字敘述列成方程式",
        ],
        pointsEn: [
          "Know what the unknown x means",
          "Solve simple one-unknown equations",
          "Check by substituting the answer back",
          "Know equation rules (add or multiply both sides the same way)",
          "Move a term: the sign changes",
          "Combine like terms (like 2x＋3x)",
          "Turn a word story into an equation",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "方程式像天平：兩邊永遠相等。解方程就是找出讓等式成立的 x。",
          ], {
            paragraphsEn: [
              "An equation is like a balance scale: both sides stay equal. Solving means finding the x that makes the equation true.",
            ],
          }),
          L("solve", "移項與求解", [
            "x＋5＝12 → x＝12−5＝7（＋5 移到右邊變 −5）。",
            "2x＝10 → x＝5（兩邊同除以 2）。",
            "合併：2x＋3x＝5x。",
          ], {
            paragraphsEn: [
              "x＋5＝12 → x＝12−5＝7 (move ＋5 to the right and it becomes −5).",
              "2x＝10 → x＝5 (divide both sides by 2).",
              "Combine: 2x＋3x＝5x.",
            ],
            tip: "解完把 x 代回原式檢查左右是否相等。",
            tipEn: "After you solve, put x back into the original equation to check both sides are equal.",
            example: {
              q: "解 3x−4＝8",
              a: "3x＝12，x＝4；檢查 3×4−4＝8 ✓",
              qEn: "Solve 3x−4＝8",
              aEn: "3x＝12, x＝4; check: 3×4−4＝8 ✓",
            },
          }),
          L("practice", "練習重點", [
            "解 x−7＝3、2x＋1＝9。",
            "把「某數的 2 倍加 3 等於 11」列成方程並求解。",
          ], {
            paragraphsEn: [
              "Solve x−7＝3 and 2x＋1＝9.",
              "Turn “2 times a number plus 3 equals 11” into an equation and solve.",
            ],
          }),
        ],
      },
      {
        id: "eq-strategy",
        name: "解題策略",
        nameEn: "How to solve",
        summary: "化簡、去括號、判斷解是否合理。",
        summaryEn: "Simplify, expand brackets, and check if the answer makes sense.",
        points: [
          "先化簡再求解的步驟",
          "含括號的方程式（去括號）",
          "分數係數的簡易方程（可選）",
          "判斷方程是否有解／解是否合理",
        ],
        pointsEn: [
          "Steps: simplify first, then solve",
          "Equations with brackets (expand the brackets)",
          "Simple equations with fraction coefficients (optional)",
          "Decide if an equation has a solution / if the solution makes sense",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "步驟：去括號 → 合併同類項 → 移項 → 係數化為 1 → 檢驗。",
          ], {
            paragraphsEn: [
              "Steps: expand brackets → combine like terms → move terms → make the coefficient 1 → check.",
            ],
          }),
          L("practice", "練習重點", [
            "解 2(x＋3)＝10。",
          ], {
            paragraphsEn: [
              "Solve 2(x＋3)＝10.",
            ],
          }),
        ],
      },
      {
        id: "eq-apply",
        name: "生活應用",
        nameEn: "Real-life problems",
        summary: "年齡、價錢、路程列式與綜合複習。",
        summaryEn: "Age, price, and distance sentences, plus mixed review.",
        points: [
          "年齡、價錢、路程等列式題",
          "由方程反推題意是否正確",
          "與前期四則運算的綜合複習",
        ],
        pointsEn: [
          "Write equations for age, price, and distance stories",
          "Check the story against the equation",
          "Mixed review with the four operations from earlier levels",
        ],
        lessons: [
          L("intro", "單元簡介", [
            "買了 3 枝筆共 36 元，一枝多少？→ 3x＝36。先列式再算。",
          ], {
            paragraphsEn: [
              "3 pens cost 36 in all. How much is one pen? → 3x＝36. Write the equation first, then solve.",
            ],
          }),
          L("practice", "練習重點", [
            "小明比小華大 4 歲，兩人年齡和 28，列式求兩人年齡。",
          ], {
            paragraphsEn: [
              "Ming is 4 years older than Hua. Their ages add to 28. Write an equation and find both ages.",
            ],
          }),
        ],
      },
    ],
  },
];

export function getMathLevelById(level) {
  return MATH_LEVELS.find((item) => item.level === Number(level)) ?? null;
}

export function getMathTopic(levelId, topicId) {
  const level = getMathLevelById(levelId);
  if (!level) return null;
  const index = level.topics.findIndex((t) => t.id === topicId);
  if (index < 0) return null;
  return {
    level,
    topic: level.topics[index],
    topicIndex: index,
    prevTopic: level.topics[index - 1] ?? null,
    nextTopic: level.topics[index + 1] ?? null,
  };
}
