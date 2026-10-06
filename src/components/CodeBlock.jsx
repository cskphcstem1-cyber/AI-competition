import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ideTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    margin: 0,
    padding: "0.75rem 0.9rem",
    background: "#1e1e1e",
    fontFamily: '"JetBrains Mono", "Source Code Pro", ui-monospace, monospace',
    fontSize: "0.8125rem",
    lineHeight: "1.55",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    fontFamily: '"JetBrains Mono", "Source Code Pro", ui-monospace, monospace',
    fontSize: "0.8125rem",
    textShadow: "none",
  },
  comment: { ...oneDark.comment, color: "#6A9955" },
  prolog: { ...oneDark.prolog, color: "#6A9955" },
  keyword: { ...oneDark.keyword, color: "#C586C0" },
  boolean: { ...oneDark.boolean, color: "#569CD6" },
  number: { ...oneDark.number, color: "#B5CEA8" },
  string: { ...oneDark.string, color: "#CE9178" },
  function: { ...oneDark.function, color: "#DCDCAA" },
  "class-name": { ...oneDark["class-name"], color: "#4EC9B0" },
  builtin: { ...oneDark.builtin, color: "#4EC9B0" },
  operator: { ...oneDark.operator, color: "#D4D4D4" },
  punctuation: { ...oneDark.punctuation, color: "#D4D4D4" },
};

function CopyIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function CodeBlock({
  children,
  label,
  language = "python",
  embedded = false,
}) {
  const code = String(children).replace(/^\n/, "").replace(/\n$/, "");
  const isPython = language === "python";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={`code-window overflow-hidden shadow-inner ring-1 ring-black/20 ${
        embedded
          ? "my-0 w-full rounded-none"
          : "mx-auto my-3 max-w-2xl rounded-lg"
      }`}
    >
      {!embedded && (
        <div className="flex items-center justify-between border-b border-white/10 bg-[#252526] px-3 py-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
            <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
            <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
            <span className="ml-1.5 truncate font-mono text-[11px] font-semibold text-slate-400">
              {label || (isPython ? "main.py" : "terminal")}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {isPython && (
              <span className="rounded bg-[#007acc]/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#9cdcfe]">
                Python
              </span>
            )}
            <div className="group relative">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded p-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
                aria-label={copied ? "Copied" : "Copy"}
              >
                {copied ? (
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <CopyIcon className="h-3.5 w-3.5" />
                )}
              </button>
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1e1e1e] px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg ring-1 ring-white/10 transition group-hover:opacity-100">
                {copied ? "Copied" : "Copy"}
              </span>
            </div>
          </div>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={ideTheme}
        showLineNumbers={isPython}
        startingLineNumber={1}
        lineNumberStyle={{
          minWidth: "1.85em",
          paddingRight: "0.85em",
          color: "#858585",
          fontSize: "0.8125rem",
          userSelect: "none",
        }}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "#1e1e1e",
          fontSize: "0.8125rem",
        }}
        codeTagProps={{
          style: {
            fontFamily:
              '"JetBrains Mono", "Source Code Pro", ui-monospace, monospace',
            fontSize: "0.8125rem",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
