import { useState } from "react";
import { useLang } from "../contexts/LangContext";

const OPEN_LINKS = [
  {
    id: "turbowarp",
    label: "TurboWarp 編輯器",
    labelEn: "TurboWarp editor",
    href: "https://turbowarp.org/editor",
    desc: "建議 · 速度快、空間大",
    descEn: "Suggested · fast and roomy",
  },
  {
    id: "scratch",
    label: "Scratch 官方編輯器",
    labelEn: "Official Scratch editor",
    href: "https://scratch.mit.edu/projects/editor/",
    desc: "可登入存檔到 Scratch 帳號",
    descEn: "Sign in to save to a Scratch account",
  },
];

const EMBED_SRC = "https://sheeptester.github.io/scratch-gui/";

const START_STEPS = [
  ["點左邊黃色「事件」", "Click yellow Events on the left"],
  ["把「當綠旗被點擊」拖到中間空白區", "Drag “when green flag clicked” to the middle"],
  ["再接「動作」積木（例如移動 10 點）", "Snap on a Motion block (for example move 10 steps)"],
  ["按右上角綠旗 ▶ 執行", "Press the green flag ▶ at the top right"],
];

export default function ScratchIDE({
  className = "",
  onClose,
  expanded = false,
  onToggleExpand,
}) {
  const { tx } = useLang();
  const [mode, setMode] = useState("embed");
  const [showTip, setShowTip] = useState(true);

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-lab shadow-lg ring-1 ring-brand/20 ${className}`}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-xs font-bold text-shell-green">
            scratch
          </span>
          <span className="truncate text-xs font-semibold text-white/80">
            IDE
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowTip((v) => !v)}
            className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/80 hover:bg-white/20"
          >
            {showTip ? tx("隱藏提示", "Hide tip") : tx("如何開始", "How to start")}
          </button>
          {typeof onToggleExpand === "function" && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="rounded-full bg-shell-green px-2.5 py-1 text-[11px] font-bold text-lab"
            >
              {expanded ? tx("顯示課程", "Show lesson") : tx("放大工作區", "Bigger workspace")}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMode("embed")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
              mode === "embed"
                ? "bg-white text-lab"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            {tx("內嵌", "Embed")}
          </button>
          <button
            type="button"
            onClick={() => setMode("launch")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
              mode === "launch"
                ? "bg-white text-lab"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            {tx("外部開啟", "Open outside")}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-white/90 hover:border-coral hover:text-coral lg:hidden"
            >
              {tx("關閉", "Close")}
            </button>
          )}
        </div>
      </div>

      {showTip && mode === "embed" && (
        <div className="shrink-0 border-b border-white/10 bg-white/5 px-3 py-2">
          <p className="mb-1 text-[11px] font-bold text-shell-green">
            {tx(
              "怎麼開始寫程式？（中間白色區就是放積木的地方）",
              "How to start coding (the white middle area is for blocks)",
            )}
          </p>
          <ol className="grid gap-0.5 text-[11px] text-white/80 sm:grid-cols-2">
            {START_STEPS.map((step, i) => (
              <li key={step[0]}>
                <span className="font-mono text-shell-green">{i + 1}.</span>{" "}
                {tx(step[0], step[1])}
              </li>
            ))}
          </ol>
        </div>
      )}

      {mode === "embed" ? (
        <div className="relative min-h-0 flex-1 bg-slate-900">
          <iframe
            title="Scratch Editor"
            src={EMBED_SRC}
            className="absolute inset-0 h-full w-full border-0 bg-white"
            allow="fullscreen; autoplay; clipboard-read; clipboard-write; accelerometer; gyroscope"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-y-auto p-4">
          <p className="text-center text-sm font-semibold text-white">
            {tx("空間不夠？用新分頁開完整編輯器", "Need more room? Open the full editor in a new tab")}
          </p>
          {OPEN_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center transition hover:border-shell-green hover:bg-white/15"
            >
              <span className="block text-sm font-bold text-shell-green">
                {tx(link.label, link.labelEn)}
              </span>
              <span className="mt-0.5 block text-xs text-white/70">
                {tx(link.desc, link.descEn)}
              </span>
            </a>
          ))}
          <button
            type="button"
            onClick={() => setMode("embed")}
            className="mt-1 text-xs font-semibold text-white/70 underline-offset-2 hover:text-shell-green hover:underline"
          >
            {tx("← 返回內嵌編輯器", "← Back to embed editor")}
          </button>
        </div>
      )}
    </div>
  );
}
