import { Link } from "react-router-dom";
import ChapterNextLink from "../components/ChapterNextLink";
import ChapterCompleteButton from "../components/ChapterCompleteButton";
import { useEffect, useState } from "react";
import CodeBlock from "../components/CodeBlock";
import Tip from "../components/Tip";
import PythonIDE from "../components/PythonIDE";
import { IdeProvider, useIde } from "../contexts/IdeContext";
import { useLang } from "../contexts/LangContext";
import { pythonChrome } from "../i18n/pythonChrome";

const TOC = [
  { id: "intro", label: "數據類型簡介", labelEn: "Data types intro" },
  { id: "int", label: "整數 int", labelEn: "Integer int" },
  { id: "float", label: "浮點數 float", labelEn: "Float" },
  { id: "str", label: "字符串 str", labelEn: "String str" },
  { id: "bool", label: "布林值 bool", labelEn: "Boolean bool" },
  { id: "list", label: "列表 list", labelEn: "List" },
  { id: "type-fn", label: "type() 函數", labelEn: "type() function", fn: "type()" },
  { id: "practice", label: "判斷練習", labelEn: "Guess the type" },
];

function CodeName({ children }) {
  const text = String(children);
  const match = text.match(/^(.*?)(\(\))$/);
  if (!match) {
    return (
      <span className="font-mono font-semibold tracking-normal">{children}</span>
    );
  }
  return (
    <span className="font-mono font-semibold tracking-normal">
      {match[1]}
      <span className="inline-block translate-y-px font-normal tracking-[0.12em]">
        {match[2]}
      </span>
    </span>
  );
}

function InlineFn({ children }) {
  const text = String(children).trim();
  const match = text.match(/^(.*?)(\(\))$/);
  if (!match) {
    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    );
  }
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-semibold">
      {match[1]}
      <span className="font-normal tracking-[0.12em]">{match[2]}</span>
    </code>
  );
}

const TYPE_SHORTCUTS = [
  {
    id: "int",
    label: "int",
    zh: "整數",
    en: "integer",
    box: "border-sky-300 bg-sky-100 hover:border-sky-500",
    labelColor: "text-sky-800",
  },
  {
    id: "float",
    label: "float",
    zh: "浮點數",
    en: "decimal",
    box: "border-teal-300 bg-teal-100 hover:border-teal-500",
    labelColor: "text-teal-800",
  },
  {
    id: "str",
    label: "str",
    zh: "字符串",
    en: "text",
    box: "border-amber-300 bg-amber-100 hover:border-amber-500",
    labelColor: "text-amber-800",
  },
  {
    id: "bool",
    label: "bool",
    zh: "布林值",
    en: "true/false",
    box: "border-emerald-300 bg-emerald-100 hover:border-emerald-500",
    labelColor: "text-emerald-800",
  },
  {
    id: "list",
    label: "list",
    zh: "列表",
    en: "list",
    box: "border-rose-300 bg-rose-100 hover:border-rose-500",
    labelColor: "text-rose-800",
  },
];

const TYPE_CARDS = [
  { value: "42", type: "整數（int）", typeEn: "Integer (int)", detail: "沒有小數點的數字", detailEn: "A number with no decimal point" },
  { value: "-7", type: "整數（int）", typeEn: "Integer (int)", detail: "負整數也是整數", detailEn: "A negative whole number is still an int" },
  { value: "3.14", type: "浮點數（float）", typeEn: "Float", detail: "有小數點", detailEn: "It has a decimal point" },
  { value: "0.0", type: "浮點數（float）", typeEn: "Float", detail: "0.0 仍是浮點數，不是整數", detailEn: "0.0 is still a float, not an int" },
  { value: '"Hello"', type: "字符串（str）", typeEn: "String (str)", detail: "用引號包起來的文字", detailEn: "Text inside quotes" },
  { value: "'Eric Un'", type: "字符串（str）", typeEn: "String (str)", detail: "單引號也可以定義字符串", detailEn: "Single quotes can make a string too" },
  { value: '"123124"', type: "字符串（str）", typeEn: "String (str)", detail: "看起來像數字，但有引號就是字串", detailEn: "Looks like a number, but quotes make it a string" },
  { value: "0", type: "整數（int）", typeEn: "Integer (int)", detail: "零也是整數", detailEn: "Zero is an integer too" },
  { value: "True", type: "布林值（bool）", typeEn: "Boolean (bool)", detail: "真／假兩種值之一", detailEn: "One of the two true/false values" },
  { value: "False", type: "布林值（bool）", typeEn: "Boolean (bool)", detail: "注意 True / False 首字母要大寫", detailEn: "True and False must start with a capital letter" },
  { value: "[1, 2, 3]", type: "列表（list）", typeEn: "List", detail: "用中括號装多個值", detailEn: "Square brackets hold many values" },
  { value: '["a", "b"]', type: "列表（list）", typeEn: "List", detail: "列表裡也可以放字符串", detailEn: "A list can also hold strings" },
];


function TypeCard({ value, type, typeEn, detail, detailEn }) {
  const [open, setOpen] = useState(false);
  const { tx } = useLang();

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={`rounded-2xl border p-4 text-left transition ${
        open
          ? "border-brand bg-brand-soft shadow-sm"
          : "border-slate-200 bg-white hover:border-brand/50 hover:bg-slate-50"
      }`}
    >
      <p className="mb-3 font-mono text-lg font-bold text-ink">{value}</p>
      {open ? (
        <div>
          <p className="text-sm font-bold text-brand-dark">{tx(type, typeEn)}</p>
          <p className="mt-1 text-xs text-muted">{tx(detail, detailEn)}</p>
        </div>
      ) : (
        <p className="text-sm font-semibold text-muted">
          {tx("點擊查看類型", "Tap to see the type")}
        </p>
      )}
    </button>
  );
}

function MobileIdeToggle() {
  const { mobileOpen, setMobileOpen } = useIde();
  if (mobileOpen) return null;
  return (
    <button
      type="button"
      onClick={() => setMobileOpen(true)}
      className="fixed bottom-5 right-5 z-40 rounded-full bg-lab px-5 py-3 font-bold text-white shadow-lg ring-2 ring-brand/40 lg:hidden"
    >
      Python IDE
    </button>
  );
}

export default function PythonChapter2() {
  return (
    <IdeProvider initialCode={'print(type(42))\nprint(type(True))\nprint(type([1, 2, 3]))\n'}>
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 2);
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const sectionIds = TOC.map((item) => item.id);
    const pickActive = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120;
      if (nearBottom) {
        setActive(sectionIds[sectionIds.length - 1]);
        return;
      }
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = id;
        }
      }
      setActive(current);
    };
    pickActive();
    window.addEventListener("scroll", pickActive, { passive: true });
    window.addEventListener("resize", pickActive);
    return () => {
      window.removeEventListener("scroll", pickActive);
      window.removeEventListener("resize", pickActive);
    };
  }, []);

  return (
    <div className="blueprint-bg lesson-with-ide">
      <div className="mx-auto max-w-5xl px-3 py-4 lg:px-5 lg:py-5">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {tx("第 2 章 · 數據類型 Datatypes", "Chapter 2 · Data types")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx(
                  "整數、浮點數、字符串、布林值與列表",
                  "Integers, floats, strings, booleans, and lists",
                )}
              </p>
          </div>
        </header>

        <div className="flex gap-4">
          <nav
            className="hidden w-full shrink-0 md:block md:w-44"
          >
            <div className="sticky top-20 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur">
              <p className="mb-3 text-sm font-bold text-ink">{ui.chapterContents}</p>
              <ul className="space-y-1">
                {TOC.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                                            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition ${
                        active === item.id
                          ? "bg-brand-soft font-semibold text-brand-dark"
                          : "text-muted hover:bg-slate-50 hover:text-ink"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-brand/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {tx(item.label, item.labelEn)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <main className="min-w-0 flex-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur sm:p-7">
              <LessonContent />
            </div>
            <div className="h-40 md:h-52" aria-hidden="true" />
          </main>
        </div>
      </div>

      <aside className="ide-rail" aria-label="Python IDE">
        <PythonIDE className="h-full min-h-0 flex-1" />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-lab/50 p-3 backdrop-blur-sm lg:hidden">
          <PythonIDE
            className="min-h-0 flex-1"
            onClose={() => setMobileOpen(false)}
          />
        </div>
      )}

      <MobileIdeToggle />
    </div>
  );
}

function LessonContent() {
  const { tx } = useLang();
  const ui = pythonChrome(tx, 2);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("數據類型 Datatypes", "Data types")}</h2>
        <p>
          {tx(
            "Python 中的數據有不同的類型。本章介紹五種常用類型：整數、浮點數、字符串、布林值與列表。點擊下方捷徑可直接跳到對應段落。",
            "Data in Python has different types. This chapter shows five common ones: integer, float, string, boolean, and list. Tap a shortcut below to jump to that part.",
          )}
        </p>
        <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TYPE_SHORTCUTS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex h-14 flex-col items-center justify-center gap-1.5 rounded-xl border px-2 text-center shadow-sm transition hover:shadow-md ${item.box}`}
            >
              <span
                className={`font-mono text-lg font-bold leading-none sm:text-xl ${item.labelColor}`}
              >
                {item.label}
              </span>
              <span className="text-sm font-bold leading-none text-ink">
                {tx(item.zh, item.en)}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="int" className="mt-10 scroll-mt-24">
        <h2>{tx("整數（Integers）", "Integers")}</h2>
        <p>
          {tx(
            "整數是 Python 中最基本的數字類型之一，用來表示不帶小數點的數值。整數可以是正數、負數或零。",
            "An integer is a whole number with no decimal point. It can be positive, negative, or zero.",
          )}
        </p>
        <h3>{ui.examples}</h3>
        <CodeBlock label="integers.py">{`10
-30
124235123423421341
-12341234
0`}</CodeBlock>
      </section>

      <section id="float" className="mt-10 scroll-mt-24">
        <h2>{tx("浮點數（Floating Point Numbers）", "Floating point numbers")}</h2>
        <p>
          {tx(
            "浮點數用來表示帶有小數點的數值，可以是正數或負數。",
            "A float is a number with a decimal point. It can be positive or negative.",
          )}
        </p>
        <Tip label={ui.tip}>
          <p>
            {tx(
              "數字必須分清整數和浮點數，這兩種數據類型在表示數值時有很大的區別，特別是處理和存儲方式不同。",
              "Know the difference: ints and floats look similar, but Python stores and uses them in different ways.",
            )}
          </p>
        </Tip>
        <h3>{ui.examples}</h3>
        <CodeBlock label="floats.py">{`10.123
-30.1241
124235123423421341.12341234
-12341234.0
0.0`}</CodeBlock>
        <h3>{tx("有趣測試", "Fun test")}</h3>
        <p>
          {tx(
            "浮點數運算有時會出現微小誤差。在右側 IDE 試試這段程式：",
            "Float math can have tiny errors. Try this in the IDE on the right:",
          )}
        </p>
        <CodeBlock label="float_test.py">{`# 測試
print((0.1 + 0.2) - 0.3)`}</CodeBlock>
      </section>

      <section id="str" className="mt-10 scroll-mt-24">
        <h2>{tx("字符串（Strings）", "Strings")}</h2>
        <p>
          {tx(
            "字符串用來表示文本數據，可以包含字母、數字、符號等字符序列。使用單引號",
            "A string is text. It can hold letters, numbers, and symbols. Use single quotes",
          )}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">'</code>{" "}
          {tx("或雙引號", "or double quotes")}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">"</code>{" "}
          {tx("來定義字符串。", "to make a string.")}
        </p>
        <h3>{ui.examples}</h3>
        <CodeBlock label="strings.py">{`"Hello"
'Eric Un'
" ' "
' " '
"123124"
"*(@&^#!&^"
"{}[]()ef2f3f"`}</CodeBlock>
      </section>

      <section id="bool" className="mt-10 scroll-mt-24">
        <h2>{tx("布林值（Boolean）", "Boolean")}</h2>
        <p>
          {tx("布林值只有兩個：", "A boolean has only two values:")}
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">True</code>
          {tx("（真）與", " (true) and ")}
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">False</code>
          {tx("（假）。常用於判斷條件是否成立。", " (false). We use them to check if something is true.")}
        </p>
        <Tip label={ui.tip}>
          <p>
            {tx(
              "在 Python 裡，True 和 False 的第一個字母必須大寫，寫成 true / false 會出錯。",
              "In Python, True and False must start with a capital letter. Writing true / false will cause an error.",
            )}
          </p>
        </Tip>
        <h3>{ui.examples}</h3>
        <CodeBlock label="bools.py">{`True
False

print(type(True))
print(5 > 3)
print(2 == 10)`}</CodeBlock>
      </section>

      <section id="list" className="mt-10 scroll-mt-24">
        <h2>{tx("列表（List）", "List")}</h2>
        <p>
          {tx("列表用來存放一組有順序的資料，用中括號", "A list stores values in order, inside square brackets")}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">[]</code>{" "}
          {tx(
            "包起來，元素之間用逗號分隔。列表可以同時放數字、字串等不同類型。",
            ". Put commas between items. A list can hold numbers, strings, and other types together.",
          )}
        </p>
        <h3>{ui.examples}</h3>
        <CodeBlock label="lists.py">{`[1, 2, 3]
["apple", "banana", "cherry"]
[1, "hello", 3.14, True]
[]

fruits = ["apple", "banana"]
print(fruits[0])
print(len(fruits))`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>
            {tx("列表的編號從 0 開始：第一個元素是", "List counting starts at 0: the first item is")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">list[0]</code>
            {tx("，不是 1。", ", not 1.")}
          </p>
        </Tip>
      </section>

      <section id="type-fn" className="mt-10 scroll-mt-24">
        <h2>
          {tx("用", "Use")} <CodeName>type()</CodeName> {tx("查看類型", "to check the type")}
        </h2>
        <p>
          {tx("Python 內建函數", "The built-in function")} <InlineFn>type()</InlineFn>{" "}
          {tx(
            "可以告訴你一個值是什麼數據類型。這在除錯時很有用。",
            "tells you what type a value is. This helps when something goes wrong.",
          )}
        </p>
        <CodeBlock label="check_type.py">{`print(type(42))
print(type(3.14))
print(type("Hello"))
print(type(True))
print(type([1, 2, 3]))`}</CodeBlock>
      </section>

      <section id="practice" className="mt-10 scroll-mt-24">
        <h2>{tx("嘗試定義以下數據屬於哪種數據類型", "Guess the type of each value")}</h2>
        <p>
          {tx(
            "先看看下面的值，判斷它們是整數、浮點數、字符串、布林值還是列表。點擊卡片可查看答案。",
            "Look at each value. Is it an int, float, string, boolean, or list? Tap a card to see the answer.",
          )}
        </p>
        <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TYPE_CARDS.map((card) => (
            <TypeCard key={card.value} {...card} />
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter2"
            practiceLabel={ui.doneChapter(2)}
            subject="python"
          />
          <Link
            to="/python/quiz/2"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="2" />

          <Link
            to="/python/chapters"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
          >
            {ui.backCatalog}
          </Link>
        </div>
      </footer>
    </article>
  );
}
