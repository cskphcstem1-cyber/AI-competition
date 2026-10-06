import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import { useIde } from "../contexts/IdeContext";
import { useLang } from "../contexts/LangContext";

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
const DEFAULT_CODE = 'print("Hello World!")\n';

let sharedPyodidePromise = null;

async function getPyodide() {
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const existing = document.querySelector("script[data-pyodide]");
      if (existing) {
        if (window.loadPyodide) {
          resolve();
          return;
        }
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = `${PYODIDE_URL}pyodide.js`;
      script.dataset.pyodide = "true";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Failed to download Pyodide"));
      document.body.appendChild(script);
    });
  }
  if (!sharedPyodidePromise) {
    sharedPyodidePromise = window.loadPyodide({ indexURL: PYODIDE_URL });
  }
  return sharedPyodidePromise;
}

function highlightPython(code) {
  try {
    return Prism.highlight(code, Prism.languages.python, "python");
  } catch {
    return code;
  }
}

export default function PythonIDE({ className = "", onClose }) {
  const { code, setCode } = useIde();
  const { tx } = useLang();
  const defaultShell = tx(
    ">>> 按 Run 執行上面的代碼",
    ">>> Press Run to run the code above",
  );
  const [output, setOutput] = useState(defaultShell);
  const [stdin, setStdin] = useState("");
  const [status, setStatus] = useState("loading");
  const [statusText, setStatusText] = useState(tx("載入中…", "Loading…"));
  const pyodideRef = useRef(null);
  const statusRef = useRef(status);
  const txRef = useRef(tx);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    txRef.current = tx;
  }, [tx]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const py = await getPyodide();
        if (cancelled) return;
        pyodideRef.current = py;
        setStatus("ready");
        setStatusText(txRef.current("就緒", "Ready"));
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setStatusText(txRef.current("失敗", "Failed"));
          setOutput(
            `>>> ${txRef.current("無法載入 Python：", "Could not load Python: ")}${err.message}`,
          );
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const runCode = useCallback(async () => {
    if (!pyodideRef.current) return;
    if (statusRef.current === "running" || statusRef.current === "loading") {
      return;
    }

    setStatus("running");
    setStatusText(tx("執行中", "Running"));
    setOutput(">>> ");

    const chunks = [">>> "];
    const pyodide = pyodideRef.current;
    const push = (text) => {
      chunks.push(text);
      setOutput(chunks.join(""));
    };

    try {
      pyodide.setStdout({ batched: (text) => push(text) });
      pyodide.setStderr({ batched: (text) => push(text) });

      const stdinData =
        stdin.endsWith("\n") || stdin === "" ? stdin : `${stdin}\n`;
      pyodide.globals.set("_stdin_data", stdinData);
      const emptyPrompt = tx("請輸入：", "Please type:");

      await pyodide.runPythonAsync(`
import builtins
import sys
from io import StringIO
from js import prompt as _js_prompt

_stdin_buffer = StringIO(_stdin_data)

def _smart_input(prompt_text=""):
    prompt_text = "" if prompt_text is None else str(prompt_text)
    sys.stdout.write(prompt_text)
    sys.stdout.flush()

    line = _stdin_buffer.readline()
    if line != "":
        value = line.rstrip("\\r\\n")
        sys.stdout.write(value + "\\n")
        sys.stdout.flush()
        return value

    result = _js_prompt(prompt_text if prompt_text.strip() else ${JSON.stringify(emptyPrompt)})
    value = "" if result is None else str(result)
    sys.stdout.write(value + "\\n")
    sys.stdout.flush()
    return value

builtins.input = _smart_input
`);

      await pyodide.runPythonAsync(code);

      if (chunks.length === 1) {
        setOutput(tx(">>> （沒有輸出）", ">>> (no output)"));
      }
      setStatus("ready");
      setStatusText(tx("完成", "Done"));
    } catch (err) {
      const message = err.message || String(err);
      const short = message.includes("EOFError")
        ? tx(
            "EOFError: input() 沒有收到輸入。請在下方填寫，或在彈出視窗按確定。",
            "EOFError: input() got no text. Type below, or press OK in the pop-up.",
          )
        : message;
      push(`\n${short}`);
      setStatus("ready");
      setStatusText(tx("錯誤", "Error"));
    }
  }, [code, stdin, tx]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runCode]);

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl bg-idle text-slate-200 shadow-xl shadow-slate-900/25 ring-1 ring-black/30 ${className}`}
      style={{ height: "100%" }}
    >
      {/* Title bar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/5 bg-idle-bar px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="flex-1 truncate text-center font-mono text-xs font-semibold text-white/90 sm:text-sm">
          IDLE Shell 3.14.7
        </span>
        <span className="shrink-0 font-mono text-[10px] text-white/40">
          {statusText}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-1 rounded px-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label={tx("關閉", "Close")}
          >
            ×
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="shrink-0 space-y-1.5 border-b border-white/5 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runCode}
            disabled={status === "loading" || status === "running" || status === "error"}
            className="rounded-lg bg-brand px-3.5 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "running"
              ? tx("執行中…", "Running…")
              : status === "loading"
                ? tx("載入中…", "Loading…")
                : "Run"}
          </button>
          <button
            type="button"
            onClick={() => setOutput(defaultShell)}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/15"
          >
            {tx("清除輸出", "Clear output")}
          </button>
          <button
            type="button"
            onClick={() => {
              setCode(DEFAULT_CODE);
              setOutput(defaultShell);
            }}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/15"
          >
            {tx("重置代碼", "Reset code")}
          </button>
        </div>
        <p className="text-[11px] text-white/40">
          {tx(
            "Ctrl+Enter 執行 · input() 可先填下方，或用彈出視窗",
            "Ctrl+Enter to run · fill input() below, or use the pop-up",
          )}
        </p>
      </div>

      {/* Editor — fixed flex share so it never collapses */}
      <div className="flex min-h-[140px] flex-[3] flex-col overflow-hidden px-3 pt-2">
        <p className="mb-1 shrink-0 px-1 text-[11px] font-semibold tracking-wide text-white/45">
          {tx("編輯器", "Editor")}
        </p>
        <div className="min-h-0 flex-1 overflow-auto rounded-xl bg-idle-panel ring-1 ring-white/5">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlightPython}
            padding={12}
            textareaId="python-ide-editor"
            className="python-ide-editor font-mono text-sm"
            style={{
              fontFamily: '"JetBrains Mono", "Source Code Pro", monospace',
              fontSize: 13,
              backgroundColor: "#060b14",
              color: "#e2e8f0",
              minHeight: "100%",
            }}
          />
        </div>
      </div>

      {/* Shell */}
      <div className="flex min-h-[120px] flex-[2] flex-col overflow-hidden px-3 py-2">
        <p className="mb-1 shrink-0 px-1 text-[11px] font-semibold tracking-wide text-white/45">
          {tx("SHELL 輸出", "SHELL output")}
        </p>
        <pre className="min-h-0 flex-1 overflow-auto rounded-xl bg-idle-panel p-3 font-mono text-xs leading-5 whitespace-pre-wrap text-shell-green ring-1 ring-white/5">
          {output}
        </pre>
        <input
          type="text"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder={tx("input() 預填答案（可選）", "Optional text for input()")}
          className="mt-2 shrink-0 rounded-lg border border-white/10 bg-idle-panel px-3 py-2 font-mono text-xs text-white/80 outline-none placeholder:text-white/30 focus:border-brand"
        />
      </div>
    </div>
  );
}
