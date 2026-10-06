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
  { id: "intro", label: "變量簡介", labelEn: "Variables intro" },
  { id: "assign", label: "賦值操作", labelEn: "Assign a value" },
  { id: "print-var", label: "輸出變量", labelEn: "Print a variable" },
  { id: "print-multi", label: "輸出多個變量", labelEn: "Print many values" },
  { id: "reassign", label: "重新賦值", labelEn: "Change the value" },
  { id: "naming-rules", label: "命名規則", labelEn: "Naming rules" },
  { id: "naming-examples", label: "命名例子", labelEn: "Name examples" },
  { id: "snake", label: "底線命名法", labelEn: "Snake case" },
  { id: "camel", label: "駝峰命名法", labelEn: "Camel case" },
  { id: "naming-practice", label: "命名練習", labelEn: "Name practice" },
  { id: "coding-practice", label: "編程練習", labelEn: "Coding practice" },
];

const NAME_CARDS = [
  {
    name: "firstName = 'Eric'",
    ok: true,
    detail: "合法：字母組成，可用駝峰命名。",
    detailEn: "OK: letters only. Camel case is fine.",
  },
  {
    name: "last Name = 'Un'",
    ok: false,
    detail: "不合法：變量名中間不能有空格。",
    detailEn: "Not OK: a variable name cannot have a space.",
  },
  {
    name: "num1 = 10",
    ok: true,
    detail: "合法：可以包含數字，但不能以數字開頭。",
    detailEn: "OK: numbers are allowed, but not at the start.",
  },
  {
    name: "2num = 20",
    ok: false,
    detail: "不合法：不能以數字開頭。",
    detailEn: "Not OK: it cannot start with a number.",
  },
  {
    name: "_num = 30",
    ok: true,
    detail: "合法：可以用底線 _ 開頭。",
    detailEn: "OK: it can start with an underscore _.",
  },
  {
    name: "age = 12",
    ok: true,
    detail: "合法：常見的小寫變量名。",
    detailEn: "OK: a common lowercase name.",
  },
  {
    name: "for = 1",
    ok: false,
    detail: "不合法：for 是 Python 保留字（keyword）。",
    detailEn: "Not OK: for is a Python keyword.",
  },
  {
    name: "total_score = 100",
    ok: true,
    detail: "合法：底線命名法（snake_case）。",
    detailEn: "OK: this is snake_case.",
  },
  {
    name: "my-name = 'Ann'",
    ok: false,
    detail: "不合法：不能使用連字號 -。",
    detailEn: "Not OK: you cannot use a hyphen -.",
  },
  {
    name: "Name = 'Bob'",
    ok: true,
    detail: "合法：但與 name 是不同的變量（大小寫有別）。",
    detailEn: "OK: but Name and name are different variables.",
  },
  {
    name: "班級 = 'A'",
    ok: true,
    detail: "合法：Python 允許中文變量名（但建議多用英文）。",
    detailEn: "OK: Chinese names work, but English names are easier.",
  },
  {
    name: "if = True",
    ok: false,
    detail: "不合法：if 是 Python 保留字（keyword）。",
    detailEn: "Not OK: if is a Python keyword.",
  },
];

const INT_NAMES = [
  ["age", "年齡", "age"],
  ["count", "計數", "count"],
  ["total", "總數", "total"],
  ["score", "分數", "score"],
  ["height", "身高", "height"],
];

const FLOAT_NAMES = [
  ["radius", "半徑", "radius"],
  ["temperature", "溫度", "temperature"],
  ["weight", "體重", "weight"],
  ["price", "價格", "price"],
];

const STR_NAMES = [
  ["name", "姓名", "name"],
  ["address", "地址", "address"],
  ["email", "電子郵件", "email"],
  ["message", "訊息", "message"],
  ["username", "使用者名稱", "username"],
];


function NameCard({ name, ok, detail, detailEn }) {
  const [open, setOpen] = useState(false);
  const { tx } = useLang();

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={`rounded-2xl border p-4 text-left transition ${
        open
          ? ok
            ? "border-brand bg-brand-soft shadow-sm"
            : "border-rose-400 bg-rose-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-brand/50 hover:bg-slate-50"
      }`}
    >
      <p className="mb-3 whitespace-nowrap font-mono text-base font-bold text-ink sm:text-lg">
        {name}
      </p>
      {open ? (
        <div>
          <p
            className={`text-sm font-bold ${
              ok ? "text-brand-dark" : "text-rose-700"
            }`}
          >
            {ok ? tx("✓ 合法", "✓ OK") : tx("✗ 不合法", "✗ Not OK")}
          </p>
          <p className="mt-1 text-xs text-muted">{tx(detail, detailEn)}</p>
        </div>
      ) : (
        <p className="text-sm font-semibold text-muted">
          {tx("點擊查看是否合法", "Tap to check if it is OK")}
        </p>
      )}
    </button>
  );
}

function NameTable({ title, rows }) {
  const { tx } = useLang();
  return (
    <div className="content-box">
      <h3 className="!mt-0 !mb-3 text-base font-bold text-ink">{title}</h3>
      <ul className="space-y-1.5">
        {rows.map(([en, zh, meaningEn]) => (
          <li
            key={en}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <code className="shrink-0 whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 font-mono text-brand-dark">
              {en}
            </code>
            <span className="shrink-0 whitespace-nowrap text-muted">
              {tx(zh, meaningEn)}
            </span>
          </li>
        ))}
      </ul>
    </div>
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

export default function PythonChapter4() {
  return (
    <IdeProvider
      initialCode={`name = "Hilary"
age = 20
print(name)
print(age)
print(f"My name is {name} and I am {age} years old.")
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 4);
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
                {tx("第 4 章 · 變量（Variables）", "Chapter 4 · Variables")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx(
                  "賦值、輸出、命名規則與程式練習",
                  "Assign, print, naming rules, and practice",
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
  const ui = pythonChrome(tx, 4);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("變量（Variables）", "Variables")}</h2>
        <p>
          {tx(
            "變量（Variables）是學習 Python 編程的重要基礎之一。變量用於存儲和表示各種類型的數據，如整數、浮點數、字符串等。",
            "Variables are a basic part of Python. A variable stores a value, such as an integer, a float, or a string.",
          )}
        </p>
        <Tip label={ui.tip}>
          <p>
            {tx(
              "變量是用來存儲數據值的容器。每個變量都有一個名稱和一個相應的值。",
              "A variable is a box that holds a value. Each variable has a name and a value.",
            )}
          </p>
        </Tip>
      </section>

      <section id="assign" className="mt-10 scroll-mt-24">
        <h2>{tx("賦值操作", "Assign a value")}</h2>
        <p>
          {tx("使用等號", "Use the equal sign")}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            =
          </code>{" "}
          {tx("來賦值給變量：", "to put a value into a variable:")}
        </p>
        <CodeBlock label="assign.py">{`x = 10  # 將整數值 10 賦給變量 x
y = 3.14  # 將浮點數值 3.14 賦給變量 y
name = 'Alice'  # 將字符串 'Alice' 賦給變量 name`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>{tx("變量名稱必須在左邊，相應的值在右邊。", "The name goes on the left. The value goes on the right.")}</p>
        </Tip>
      </section>

      <section id="print-var" className="mt-10 scroll-mt-24">
        <h2>{tx("輸出變量", "Print a variable")}</h2>
        <p>
          {tx("建立變量後，可以用", "After you make a variable, use")}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            print()
          </code>{" "}
          {tx("把變量儲存的值輸出到螢幕上。", "to show its value on the screen.")}
        </p>
        <CodeBlock label="print_var.py">{`name = "Hilary"
age = 20

print(name)
print(age)`}</CodeBlock>
      </section>

      <section id="print-multi" className="mt-10 scroll-mt-24">
        <h2>{tx("輸出超過 1 個變量和資料", "Print more than one value")}</h2>
        <p>
          {tx("除了單獨輸出每個變量，也可以在一次", "You can print many values in one")}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            print()
          </code>{" "}
          {tx("中輸出多個變量和文字。", "call, not only one at a time.")}
        </p>
        <CodeBlock label="print_multi.py">{`name = "Hilary"
age = 20
# Printing more than 1 variable and data.

#1 print with ,
print("My name is", name, "and I am", age, "years old.")

#2 print with fstring
print(f"My name is {name} and I am {age} years old.")`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>
            {tx("使用逗號", "With a comma")}{" "}
            <code className="rounded bg-white px-1 font-mono text-xs">,</code>{" "}
            {tx(
              "時，print() 會自動在值之間加入空格；使用 f-string 時，變量要寫在大括號",
              ", print() adds a space between values. With an f-string, put the variable inside braces",
            )}{" "}
            <code className="rounded bg-white px-1 font-mono text-xs">
              {"{}"}
            </code>{" "}
            {tx("裡面。", ".")}
          </p>
        </Tip>
      </section>

      <section id="reassign" className="mt-10 scroll-mt-24">
        <h2>{tx("變量的重新賦值", "Give a new value")}</h2>
        <p>
          {tx(
            "相同名稱的變量可以賦予新的數據，原本的數據會被新的數據所取代。",
            "You can give the same variable a new value. The old value is replaced.",
          )}
        </p>
        <CodeBlock label="reassign.py">{`name = "Hilary"
print(name)
name = "Eric"
print(name)`}</CodeBlock>
      </section>

      <section id="naming-rules" className="mt-10 scroll-mt-24">
        <h2>{tx("變量命名規則", "Naming rules")}</h2>
        <ul>
          <li>
            {tx("變量名可以包含字母、數字、中文、和下劃線", "A name can have letters, numbers, Chinese characters, and an underscore")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              _
            </code>
            {tx("，但不能以數字開頭。", ", but it cannot start with a number.")}
          </li>
          <li>
            {tx("變量名區分大小寫，即", "Names care about capital letters, so")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              Name
            </code>{" "}
            {tx("和", "and")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              name
            </code>{" "}
            {tx("是不同的變量。", "are different variables.")}
          </li>
          <li>
            {tx("Python 中有一些保留字（keywords）不能用作變量名，如", "Some words are reserved and cannot be names, such as")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              if
            </code>
            、
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              for
            </code>
            、
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              while
            </code>{" "}
            {tx("等。", ".")}
          </li>
          <li>{tx("以小寫開頭（一般變量慣例）。", "Start with a lowercase letter (usual style).")}</li>
        </ul>
        <Tip label={ui.tip}>
          <p>
            {tx(
              "變量名稱儘量不要胡亂命名，要和儲存的資料有關係，能夠清晰地描述其所儲存的資料。",
              "Pick a name that matches the data, so you can tell what it stores.",
            )}
          </p>
        </Tip>
      </section>

      <section id="naming-examples" className="mt-10 scroll-mt-24">
        <h2>{tx("變量命名例子", "Name examples")}</h2>
        <div className="my-5 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]">
          <NameTable title={tx("整數變量名稱", "Integer names")} rows={INT_NAMES} />
          <NameTable title={tx("浮點數變量名稱", "Float names")} rows={FLOAT_NAMES} />
          <NameTable title={tx("字符串變量名稱", "String names")} rows={STR_NAMES} />
        </div>
      </section>

      <section id="snake" className="mt-10 scroll-mt-24">
        <h2>{tx("底線命名法（Snake Case）", "Snake case")}</h2>
        <p>
          {tx(
            "底線命名法又稱為下劃線命名法，變量名中的字母全部小寫，單詞之間用底線",
            "In snake case, all letters are lowercase. Words are split with an underscore",
          )}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            _
          </code>{" "}
          {tx(
            "分隔。這種命名方式通常在 Python 中被廣泛使用，特別是在變量名稱和函數名稱中。",
            ". Python uses this a lot for variable names and function names.",
          )}
        </p>
        <ul>
          <li>{tx("所有字母小寫。", "All letters are lowercase.")}</li>
          <li>
            {tx("單詞之間用底線", "Split words with an underscore")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              _
            </code>{" "}
            {tx("分隔。", ".")}
          </li>
          <li>{tx("適合用於變量名、函數名和常數名。", "Good for variables, functions, and constants.")}</li>
        </ul>
        <CodeBlock label="snake_case.py">{`first_name = 'John'
last_name = 'Doe'
age_of_person = 30`}</CodeBlock>
      </section>

      <section id="camel" className="mt-10 scroll-mt-24">
        <h2>{tx("駝峰命名法（Camel Case）", "Camel case")}</h2>
        <p>
          {tx(
            "駝峰命名法將變量名稱中的每個單詞首字母大寫，並且單詞之間沒有空格或其他分隔符號。",
            "In camel case, each new word starts with a capital letter. There is no space or underscore.",
          )}
        </p>
        <div className="my-4 grid gap-3 sm:grid-cols-2">
          <div className="content-box">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
              {tx("小駝峰命名法", "Lower camel case")}
            </h3>
            <ul className="!mb-0 space-y-1 text-sm">
              <li>{tx("第一個單詞的首字母小寫，後面每個單詞的首字母大寫。", "The first word is lowercase. Later words start with a capital.")}</li>
              <li>{tx("通常用於變量名稱和函數名稱。", "Often used for variables and functions.")}</li>
            </ul>
          </div>
          <div className="content-box">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
              {tx("大駝峰命名法", "Upper camel case")}
            </h3>
            <ul className="!mb-0 space-y-1 text-sm">
              <li>{tx("每個單詞的首字母都大寫。", "Every word starts with a capital letter.")}</li>
              <li>{tx("通常用於類（Class）的名稱。", "Often used for class names.")}</li>
            </ul>
          </div>
        </div>
        <h3>{tx("小駝峰命名法示例", "Lower camel case example")}</h3>
        <CodeBlock label="camel_case.py">{`firstName = 'Jane'
lastName = 'Smith'
ageOfPerson = 25`}</CodeBlock>
      </section>

      <section id="naming-practice" className="mt-10 scroll-mt-24">
        <h2>{tx("變量命名練習", "Name practice")}</h2>
        <p>{tx("以下哪些是 Python 可以接受的變量名稱？點擊查看答案。", "Which names are OK in Python? Tap a card to see the answer.")}</p>
        <div className="my-5 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]">
          {NAME_CARDS.map((card) => (
            <NameCard key={card.name} {...card} />
          ))}
        </div>
      </section>

      <section id="coding-practice" className="mt-10 scroll-mt-24">
        <h2>{tx("編程練習", "Coding practice")}</h2>

        <div className="content-box mt-4">
          <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
            {tx("練習 1 · 國家與首都", "Practice 1 · Country and capital")}
          </h3>
          <ul className="text-sm">
            <li>
              {tx("建立變量", "Make a variable")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                country
              </code>
              {tx("，儲存一個國家名稱（例如", " that stores a country name (for example")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                &quot;China&quot;
              </code>
              ）。
            </li>
            <li>
              {tx("建立變量", "Make a variable")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                capital
              </code>
              {tx("，儲存該國的首都（例如", " that stores the capital (for example")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                &quot;Beijing&quot;
              </code>
              ）。
            </li>
            <li>
              {tx("使用", "Use")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                print()
              </code>{" "}
              {tx("輸出一句話，格式為：首都 is the capital of 國家。", " to print: capital is the capital of country.")}
            </li>
          </ul>
          <p className="mt-2 text-sm">
            <strong className="text-ink">{tx("輸出格式：", "Output format: ")}</strong>{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
              {"{capital} is the capital of {country}"}
            </code>
          </p>
          <p className="!mb-0 text-sm text-muted">
            {tx("例子：", "Example: ")}Beijing is the capital of China
          </p>
        </div>

        <div className="content-box mt-4">
          <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
            {tx("練習 2 · 商品與價格", "Practice 2 · Product and price")}
          </h3>
          <ul className="text-sm">
            <li>
              {tx("建立變量", "Make a variable")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                product
              </code>
              {tx("，儲存商品名稱（例如", " that stores a product name (for example")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                &quot;Laptop&quot;
              </code>
              ）。
            </li>
            <li>
              {tx("建立變量", "Make a variable")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                price_mop
              </code>
              {tx("，儲存價格，單位為澳門幣（例如 8999）。", " that stores the price in MOP (for example 8999).")}
            </li>
            <li>
              {tx("使用", "Use")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                print()
              </code>{" "}
              {tx("輸出一句話，說明商品價格。", " to print a sentence about the price.")}
            </li>
          </ul>
          <p className="mt-2 text-sm">
            <strong className="text-ink">{tx("輸出格式：", "Output format: ")}</strong>{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
              {"{product} costs $ {price_mop} MOP"}
            </code>
          </p>
          <p className="!mb-0 text-sm text-muted">
            {tx("例子：", "Example: ")}Laptop costs $ 8999 MOP
          </p>
        </div>

        <div className="content-box mt-4">
          <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
            {tx("練習 3 · 電影推薦", "Practice 3 · Movie tip")}
          </h3>
          <ul className="text-sm">
            <li>
              {tx("建立變量", "Make a variable")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                movie_title
              </code>
              {tx("，儲存電影名稱（例如", " that stores a movie name (for example")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                &quot;Inside Out&quot;
              </code>
              ）。
            </li>
            <li>
              {tx("建立變量", "Make a variable")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                director
              </code>
              {tx("，儲存導演名字（例如", " that stores the director (for example")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                &quot;Pete Docter&quot;
              </code>
              ）。
            </li>
            <li>
              {tx("建立變量", "Make a variable")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                release_year
              </code>
              {tx("，儲存上映年份（例如 2015）。", " that stores the year (for example 2015).")}
            </li>
            <li>
              {tx("使用", "Use")}{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                print()
              </code>{" "}
              {tx("輸出一句推薦這部電影的話。", " to print a sentence that recommends the movie.")}
            </li>
          </ul>
          <p className="mt-2 text-sm">
            <strong className="text-ink">{tx("輸出格式：", "Output format: ")}</strong>{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
              {
                "I recommend watching the movie {movie_title} directed by {director} released in {release_year}"
              }
            </code>
          </p>
          <p className="!mb-0 text-sm text-muted">
            {tx("例子：", "Example: ")}I recommend watching the movie Inside Out directed by Pete
            Docter released in 2015
          </p>
        </div>

        <p className="mt-4 text-sm text-muted">
          {tx("在右側 IDE 試試完成以上練習！", "Try these in the IDE on the right!")}
        </p>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter4"
            practiceLabel={ui.doneChapter(4)}
            subject="python"
          />
          <Link
            to="/python/quiz/4"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="4" />

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
