import { Link } from "react-router-dom";
import ShortDivision from "../components/ShortDivision";
import { useLang } from "../contexts/LangContext";

const HEX_DIGITS = [
  ["A", "10"],
  ["B", "11"],
  ["C", "12"],
  ["D", "13"],
  ["E", "14"],
  ["F", "15"],
];

export default function HexChapter() {
  const { tx } = useLang();
  const toc = [
    { id: "what", label: tx("十六進制是什麼", "What is hexadecimal?") },
    { id: "to-denary", label: tx("十六進制轉十進制", "Hex to denary") },
    { id: "to-hex", label: tx("十進制轉十六進制", "Denary to hex") },
    { id: "example", label: tx("例題", "Worked example") },
    { id: "practice", label: tx("練習", "Practice") },
  ];

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Mathematics · Topic 4
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Hexadecimal
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {tx(
                "適合小四到小六。先認識 A 到 F，再學十六進制和十進制怎樣互相轉換。",
                "For P4–P6. First learn A to F, then how hex and denary change into each other.",
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
          id="what"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">
            {tx("十六進制 ", "Hexadecimal ")}
            <span className="font-mono text-base font-semibold text-brand">Hexadecimal</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "十六進制的英文名稱是 hexadecimal。十進制用 0 到 9，二進制只用 0 和 1。十六進制每一位可以是 0 到 15。",
              "The English name is hexadecimal. Denary uses 0 to 9. Binary uses only 0 and 1. Each hex place can be 0 to 15.",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "可是一個位置只能寫一個符號，10 到 15 會佔兩個位，所以改用字母：",
              "But one place can only hold one symbol. 10 to 15 would use two digits, so we use letters:",
            )}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {HEX_DIGITS.map(([digit, value]) => (
              <div key={digit} className="rounded-xl bg-slate-50 px-2 py-3 text-center">
                <p className="font-mono text-lg font-bold text-ink">{digit}</p>
                <p className="text-xs text-muted">{tx(`等於 ${value}`, `equals ${value}`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {tx(
              "由右邊數起，個位乘 1，左邊那一位乘 16，再左邊乘 256。256 就是 16×16。寫下標時，16 表示十六進制。",
              "From the right, ones are ×1, the next place is ×16, then ×256. 256 is 16×16. The subscript 16 means hexadecimal.",
            )}
          </p>
        </section>

        <section
          id="to-denary"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">
            {tx("十六進制轉成十進制", "Hexadecimal to denary")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "先把字母換回數字，再乘上那一位的值，加起來就是十進制。",
              "First change letters back to numbers, multiply by each place value, then add.",
            )}
          </p>
          <p className="mt-4 text-sm font-bold text-ink">{tx("例子：1A₁₆", "Example: 1A₁₆")}</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink">
            <li>{tx("A 等於 10。", "A equals 10.")}</li>
            <li>{tx("左邊的 1 乘 16，右邊的 A 乘 1。", "The 1 on the left is ×16. The A on the right is ×1.")}</li>
            <li>1×16 + 10×1 = 26。</li>
          </ol>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm font-bold leading-7 text-ink">
            1A<sub>16</sub> = 1×16 + 10×1 = 26<sub>10</sub>
          </p>
          <p className="mt-4 text-sm font-bold text-ink">{tx("例子：A3C₁₆", "Example: A3C₁₆")}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "由右往左，每一位分別乘 1、16、256。A 是 10，C 是 12。",
              "From right to left, multiply by 1, 16, then 256. A is 10. C is 12.",
            )}
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink">
            <li>{tx("A 在 256 那一位：10 × 256 = 2560。", "A is in the 256 place: 10 × 256 = 2560.")}</li>
            <li>{tx("3 在 16 那一位：3 × 16 = 48。", "3 is in the 16 place: 3 × 16 = 48.")}</li>
            <li>{tx("C 在個位：12 × 1 = 12。", "C is in the ones place: 12 × 1 = 12.")}</li>
          </ol>
          <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 font-mono text-sm font-bold leading-7 text-ink">
            A3C<sub>16</sub> = 10×16<sup>2</sup> + 3×16<sup>1</sup> + 12×16<sup>0</sup>
            <br />= 2560 + 48 + 12 = 2620<sub>10</sub>
          </p>
        </section>

        <section
          id="to-hex"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">
            {tx("十進制轉成十六進制", "Denary to hexadecimal")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "寫法和二進制的短除一樣。短除就是一條短短的除法直式：左邊寫除以 16，中間寫商，右邊寫餘數。商變成 0 就停，餘數由下往上讀。餘數如果是 10 到 15，寫成 A 到 F。",
              "Use the same short division as binary. Write ÷16 on the left, the quotient in the middle, and the remainder on the right. Stop when the quotient is 0. Read remainders bottom to top. If a remainder is 10 to 15, write A to F.",
            )}
          </p>
          <p className="mt-4 text-sm font-bold text-ink">
            {tx("例子：435₁₀ 寫成十六進制", "Example: write 435₁₀ in hex")}
          </p>
          <ShortDivision
            divisor="16"
            start="435"
            steps={[
              { quotient: "27", remainder: "3" },
              { quotient: "1", remainder: tx("11，寫成 B", "11, write as B") },
              { quotient: "0", remainder: "1" },
            ]}
          />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx("由下往上讀：1、B、3。", "Read bottom to top: 1, B, 3.")}
          </p>
          <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 font-mono text-sm font-bold text-ink">
            435<sub>10</sub> = 1B3<sub>16</sub>
          </p>
        </section>

        <section
          id="example"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{tx("例題", "Worked example")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx("10000100000₂ 等於下面哪一個？", "Which one equals 10000100000₂?")}
          </p>
          <ul className="mt-3 space-y-1 text-sm text-ink">
            <li>A. 41<sub>10</sub></li>
            <li>B. 42<sub>16</sub></li>
            <li>C. 410<sub>16</sub></li>
            <li>D. 420<sub>16</sub></li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {tx(
              "先把二進制轉成十進制。由右邊開始數，次方是 0、1、2……這串數字有 11 位，是 1 的是最左邊那顆，和由右數第 6 顆。它們的次方是 10 和 5。",
              "First change binary to denary. From the right, powers are 0, 1, 2… This number has 11 digits. The 1s are the left-most bit and the 6th from the right. Their powers are 10 and 5.",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "2¹⁰ = 1024，2⁵ = 32，所以這個二進制是 1024 + 32 = 1056₁₀。",
              "2¹⁰ = 1024 and 2⁵ = 32, so this binary is 1024 + 32 = 1056₁₀.",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {tx(
              "再檢查 D。420₁₆ 是 4 個 256、2 個 16，和 0 個 1。16×16 = 256，所以 4×256 = 1024，2×16 = 32。加起來也是 1056。",
              "Now check D. 420₁₆ is 4×256, 2×16, and 0×1. 16×16 = 256, so 4×256 = 1024 and 2×16 = 32. That also adds to 1056.",
            )}
          </p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm font-bold leading-7 text-ink">
            2<sup>10</sup> + 2<sup>5</sup> = 1056<sub>10</sub>
            <br />
            4×16<sup>2</sup> + 2×16<sup>1</sup> + 0 = 1056<sub>10</sub>
          </p>
          <p className="mt-3 text-sm font-bold text-brand">
            {tx("兩邊一樣，所以答案是 D。", "Both sides match, so the answer is D.")}
          </p>
        </section>

        <section
          id="practice"
          className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{tx("練習", "Practice")}</h2>
          <p className="mt-3 text-sm text-muted">
            {tx("先自己算，再對答案。登入後答題可賺代幣。", "Try first, then check. Sign in so answers can earn tokens.")}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-ink">
            <li className="rounded-xl bg-slate-50 px-4 py-3">
              {tx("1A₁₆ 是十進制的幾？", "What is 1A₁₆ in denary?")}{" "}
              <span className="font-bold text-brand">26</span>
            </li>
            <li className="rounded-xl bg-slate-50 px-4 py-3">
              {tx("A3C₁₆ 是十進制的幾？", "What is A3C₁₆ in denary?")}{" "}
              <span className="font-bold text-brand">2620</span>
            </li>
            <li className="rounded-xl bg-slate-50 px-4 py-3">
              {tx("435₁₀ 的十六進制是？", "What is 435₁₀ in hex?")}{" "}
              <span className="font-bold text-brand">1B3</span>
            </li>
          </ul>
          <Link
            to="/math/hex/quiz"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 hover:brightness-105"
          >
            {tx("開始練習 · 賺代幣", "Start practice · earn tokens")}
          </Link>
        </section>
      </div>
    </div>
  );
}
