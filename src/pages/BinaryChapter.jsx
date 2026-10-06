import { useState } from "react";
import { Link } from "react-router-dom";
import ShortDivision from "../components/ShortDivision";
import Tip from "../components/Tip";
import { useLang } from "../contexts/LangContext";

function BulbActivity({ tx }) {
  const BULB_VALUES = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
  const [on, setOn] = useState(() => BULB_VALUES.map((value) => value <= 8));
  const lit = BULB_VALUES.filter((_, i) => on[i]);
  const total = lit.reduce((sum, value) => sum + value, 0);
  const binary = on.map((bit) => (bit ? "1" : "0")).join("");

  return (
    <div className="mt-4">
      <p className="text-center text-sm font-semibold text-ink">
        {tx("點擊燈泡，打開或關掉。", "Tap a bulb to turn it on or off.")}
      </p>
      <div className="mt-3 flex justify-center gap-1.5 overflow-x-auto py-1">
        {BULB_VALUES.map((value, i) => (
          <div key={value} className="flex w-11 shrink-0 flex-col items-center gap-1">
            <button
              type="button"
              aria-pressed={on[i]}
              aria-label={tx(
                `${value} 的燈泡，目前${on[i] ? "亮著" : "關掉"}`,
                `Bulb ${value}, now ${on[i] ? "on" : "off"}`,
              )}
              onClick={() =>
                setOn((prev) => prev.map((bit, index) => (index === i ? !bit : bit)))
              }
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-sm font-bold leading-none transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                on[i]
                  ? "border-amber-400 bg-amber-200 text-ink shadow-sm"
                  : "border-ink bg-white text-ink hover:border-amber-400"
              }`}
            >
              {on[i] ? "1" : "0"}
            </button>
            <span className="whitespace-nowrap text-[11px] font-bold text-muted">{value}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-muted">
        {lit.length === 0 ? (
          tx("全部關掉，是 0。", "All off means 0.")
        ) : (
          <>
            <span className="font-mono font-bold text-ink">
              {binary}
              <sub>2</sub>
            </span>
            {" = "}
            {lit.join(" + ")} = {total}
            <sub>10</sub>
          </>
        )}
      </p>
    </div>
  );
}

export default function BinaryChapter() {
  const { tx } = useLang();
  const toc = [
    { id: "denary", label: tx("十進制 Denary", "Denary") },
    { id: "why", label: tx("二進制 Binary", "Binary") },
    { id: "to-binary", label: tx("十進制轉二進制", "Denary to binary") },
    { id: "to-denary", label: tx("二進制轉十進制", "Binary to denary") },
    { id: "practice", label: tx("練習", "Practice") },
  ];

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Mathematics · Topic 3
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Binary
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {tx(
                "適合小四到小六。先認識平常用的十進制，再學它和二進制怎樣互相轉換。",
                "For P4–P6. First learn everyday denary, then how it and binary change into each other.",
              )}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink">
              {tx(
                "STEM 裏，電腦、手機和電路都用「開／關」來工作，數學上就寫成 0 和 1。學二進制，就是在學科技怎樣數數、怎樣傳資料。",
                "In STEM, computers, phones, and circuits work with on and off. Math writes that as 0 and 1. Binary is how technology counts and sends information.",
              )}
            </p>
          </div>
          <Link
            to="/math"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
          >
            {tx("← 數學", "← Math")}
          </Link>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-brand hover:text-brand-dark"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <section
          id="denary"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">
            {tx("十進制 ", "Denary ")}
            <span className="font-mono text-base font-semibold text-brand">Denary</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "我們平常用的是十進制，英文是 denary。兩隻手有 10 隻手指，所以用 0 到 9 這十個數字。",
              "We usually use denary (base 10). Two hands have 10 fingers, so we use the ten digits 0 to 9.",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "數到 9 之後，個位用完了，就要進到十位，寫成 10。這叫做滿十進一。10 的意思是「1 個十，和 0 個一」。再往上，十個十是一百，十個一百是一千。",
              "After 9, the ones place is full, so we move to tens and write 10. That is “ten makes one ten.” 10 means “1 ten and 0 ones.” Ten tens make 100. Ten hundreds make 1000.",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "由右邊數起，個位是 1，十位是 10，百位是 100，千位是 1000，萬位是 10000。把 10234 拆開來看：",
              "From the right: ones are 1, tens are 10, hundreds are 100, thousands are 1000, ten-thousands are 10000. Split 10234 like this:",
            )}
          </p>
          <ul className="mt-3 space-y-1 text-sm leading-relaxed text-ink">
            <li>{tx("1 在萬位：1 × 10000 = 10000", "1 in the ten-thousands: 1 × 10000 = 10000")}</li>
            <li>{tx("0 在千位：0 × 1000 = 0", "0 in the thousands: 0 × 1000 = 0")}</li>
            <li>{tx("2 在百位：2 × 100 = 200", "2 in the hundreds: 2 × 100 = 200")}</li>
            <li>{tx("3 在十位：3 × 10 = 30", "3 in the tens: 3 × 10 = 30")}</li>
            <li>{tx("4 在個位：4 × 1 = 4", "4 in the ones: 4 × 1 = 4")}</li>
          </ul>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm font-bold leading-7 text-ink">
            10234<sub>10</sub> = 1×10<sup>4</sup> + 0×10<sup>3</sup> + 2×10<sup>2</sup> + 3×10<sup>1</sup> + 4×10<sup>0</sup>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "最右邊的次方是 0。10⁰ 就是 1，10¹ 是 10，10² 是 10×10=100。這種拆開來的寫法叫做展開式。",
              "The right-most power is 0. 10⁰ is 1, 10¹ is 10, 10² is 10×10=100. This split form is called expanded form.",
            )}
          </p>
          <Tip centerLabel oneLine label={tx("提示", "Tip")}>
            {tx(
              "數字右下角的小字讀做下標（subscript），用來說明進制。10234₁₀ 的 10 表示十進制。",
              "The small number at the bottom right is a subscript. It shows the base. The 10 in 10234₁₀ means denary.",
            )}
          </Tip>
        </section>

        <section
          id="why"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">
            {tx("二進制 ", "Binary ")}
            <span className="font-mono text-base font-semibold text-brand">Binary</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "電腦裡面的資料，可以想成一排燈泡。燈泡只有兩種狀態：亮著，或者關掉。亮著寫成 1，關掉寫成 0。",
              "Think of computer data as a row of bulbs. A bulb is only on or off. On is 1. Off is 0.",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "它沒有 2、3、4 這些數字，因為一顆燈泡不能「亮一半」。所以電腦數數時，只用這兩個數字。",
              "There is no 2, 3, or 4, because a bulb cannot be “half on.” So computers count with only these two digits. ",
            )}
            <span className="inline-block whitespace-nowrap">
              {tx("這種數法叫做二進制，英文是 binary。", "This counting system is binary.")}
            </span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "它和十進制用的是同一種展開式，只是每一位不再乘 10，而是乘 2。",
              "It uses the same expanded form as denary, but each place is ×2, not ×10.",
            )}
          </p>
          <BulbActivity tx={tx} />
        </section>

        <section
          id="to-binary"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">
            {tx("十進制轉成二進制", "Denary to binary")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "要把十進制寫成二進制，就一直除以 2。這種寫法叫做短除：不用寫很長的除法直式，只把「除以幾、商、餘數」排成一條短短的直式。",
              "To write denary as binary, keep dividing by 2. This is short division: you only line up divisor, quotient, and remainder.",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "商就是除完得到的答案。例如 6÷2=3，3 是商，多出來的 0 是餘數。商再拿去除，直到商變成 0 就停。右邊的餘數由下往上讀，就是二進制。",
              "The quotient is the answer after dividing. Example: 6÷2=3, so 3 is the quotient and 0 is the remainder. Divide the quotient again until it is 0. Read remainders from bottom to top to get binary.",
            )}
          </p>
          <p className="mt-4 text-sm font-bold text-ink">
            {tx("例子：6₁₀ 寫成二進制", "Example: write 6₁₀ in binary")}
          </p>
          <ShortDivision
            divisor="2"
            start="6"
            steps={[
              { quotient: "3", remainder: "0" },
              { quotient: "1", remainder: "1" },
              { quotient: "0", remainder: "1" },
            ]}
          />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "左邊的 2 表示每次都除以 2。中間由上到下是 6、3、1、0。由下往上讀餘數：1、1、0。",
              "The 2 on the left means divide by 2 each time. The middle goes 6, 3, 1, 0 from top to bottom. Read remainders bottom to top: 1, 1, 0.",
            )}
          </p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm font-bold text-ink">
            6<sub>10</sub> = 110<sub>2</sub>
          </p>
          <p className="mt-4 text-sm font-bold text-ink">
            {tx("例子：25₁₀ 寫成二進制", "Example: write 25₁₀ in binary")}
          </p>
          <ShortDivision
            divisor="2"
            start="25"
            steps={[
              { quotient: "12", remainder: "1" },
              { quotient: "6", remainder: "0" },
              { quotient: "3", remainder: "0" },
              { quotient: "1", remainder: "1" },
              { quotient: "0", remainder: "1" },
            ]}
          />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx("由下往上讀餘數：1、1、0、0、1。", "Read remainders bottom to top: 1, 1, 0, 0, 1.")}
          </p>
          <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 font-mono text-sm font-bold text-ink">
            25<sub>10</sub> = 11001<sub>2</sub>
          </p>
        </section>

        <section
          id="to-denary"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">
            {tx("二進制轉成十進制", "Binary to denary")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "要把二進制寫成十進制，就用次方。由右邊數起，第一位的次方是 0。每向左一格，次方就加 1：0、1、2、3……",
              "To write binary as denary, use powers. From the right, the first place is power 0. Each step left adds 1: 0, 1, 2, 3…",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "次方是「自己乘自己多少次」。2¹ 就是 2。2² 是 2×2=4。2³ 是 2×2×2=8。2⁰ 特別一點：任何數的 0 次方都是 1，所以 2⁰ 是 1。",
              "A power means multiply a number by itself that many times. 2¹ is 2. 2² is 2×2=4. 2³ is 2×2×2=8. 2⁰ is special: any number to the power 0 is 1, so 2⁰ is 1.",
            )}
          </p>
          <p className="mt-4 text-sm font-bold text-ink">
            {tx("例子：1110₂ 寫成十進制", "Example: write 1110₂ in denary")}
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink">
            <li>
              {tx(
                "先數有幾位。1110 有 4 位，次方由右到左是 0、1、2、3。最左邊就是 2³。",
                "Count the places. 1110 has 4 digits. Powers from right to left are 0, 1, 2, 3. The left-most is 2³.",
              )}
            </li>
            <li>
              {tx(
                "每一位乘上自己的次方。看到 0，乘完還是 0，可以留下來。",
                "Multiply each digit by its power. A 0 stays 0 after multiplying.",
              )}
            </li>
            <li>{tx("再把每個次方算出來，加在一起。", "Work out each power, then add them.")}</li>
          </ol>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm font-bold leading-7 text-ink">
            1110<sub>2</sub> = 1×2<sup>3</sup> + 1×2<sup>2</sup> + 1×2<sup>1</sup> + 0×2<sup>0</sup>
          </p>
          <ul className="mt-3 space-y-1 text-sm leading-relaxed text-ink">
            <li>1×2<sup>3</sup> = 1×8 = 8</li>
            <li>1×2<sup>2</sup> = 1×4 = 4</li>
            <li>1×2<sup>1</sup> = 1×2 = 2</li>
            <li>0×2<sup>0</sup> = 0×1 = 0</li>
          </ul>
          <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 font-mono text-sm font-bold leading-7 text-ink">
            8 + 4 + 2 + 0 = 14<sub>10</sub>
          </p>
          <Tip centerLabel label={tx("提示", "Tip")}>
            {tx(
              "最右邊的次方是 0，不是 1。漏了這一步，整個答案都會錯。",
              "The right-most power is 0, not 1. Miss this and the whole answer is wrong.",
            )}
          </Tip>
        </section>

        <section
          id="practice"
          className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{tx("練習", "Practice")}</h2>
          <p className="mt-3 text-sm text-muted">
            {tx(
              "把十進制和二進制互相轉換。登入後答題可賺代幣。",
              "Convert denary and binary. Sign in so answers can earn tokens.",
            )}
          </p>
          <Link
            to="/math/binary/quiz"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 hover:brightness-105"
          >
            {tx("開始練習 · 賺代幣", "Start practice · earn tokens")}
          </Link>
        </section>
      </div>
    </div>
  );
}
