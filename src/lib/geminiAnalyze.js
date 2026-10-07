/**
 * Ask Gemini to summarize wrong quiz items for a parent report.
 * Prefers Netlify function (server-side key). Falls back to Vite env for local dev.
 */

const MODEL = "gemini-3.8-flash";

function buildPrompt({
  lang = "zh",
  studentName = "",
  title = "",
  subtitle = "",
  score = 0,
  total = 0,
  pct = 0,
  wrongItems = [],
}) {
  const wrongBlock =
    Array.isArray(wrongItems) && wrongItems.length > 0
      ? wrongItems
          .slice(0, 20)
          .map((item, i) => {
            const n = item.index ?? i + 1;
            return [
              `${n}. ${item.question || "(question)"}`,
              `   Student answer: ${item.chosen ?? "(blank / timed out)"}`,
              `   Correct answer: ${item.expected ?? "(unknown)"}`,
            ].join("\n");
          })
          .join("\n")
      : "(No wrong answers listed — student may have scored 100%.)";

  if (lang === "en") {
    return `You are a friendly primary-school STEM tutor writing a short note for a parent.

Student: ${studentName || "the student"}
Test: ${title}${subtitle ? ` (${subtitle})` : ""}
Score: ${score}/${total} (${pct}%)

Wrong questions:
${wrongBlock}

Write in simple English for parents of primary students (P4–P6).
Use this structure:
1) One short opening sentence about the result.
2) "Needs more practice:" — list the skills/topics that were wrong (bullet points).
3) "What to do next:" — 2–4 concrete study tips (revisit which chapter/lab, try which practice).
Keep it under 180 words. No markdown headings with #. Do not invent questions that were not listed. Be encouraging, never harsh.`;
  }

  return `你是親切的小學 STEM 導師，要寫一封給家長看的短評。

學生：${studentName || "學生"}
測驗：${title}${subtitle ? `（${subtitle}）` : ""}
成績：${score}/${total}（${pct}%）

答錯的題目：
${wrongBlock}

請用繁體中文、家長看得懂的簡單句子。結構：
1）一句話總結這次表現。
2）「需要加強：」用條列寫出錯題對應的課題／技能。
3）「建議下一步：」寫 2–4 個具體複習建議（例如重看哪一章、再做哪種練習）。
全篇約 180 字以內。不要用 # 標題。不要虛構清單以外的題目。語氣鼓勵，不要責備。`;
}

function buildMonthPrompt({ lang = "zh", studentName = "", month = "", tests = [] }) {
  const lines = (Array.isArray(tests) ? tests : [])
    .slice(0, 40)
    .map((item, i) => {
      const score =
        item.score != null && item.total != null
          ? `${item.score}/${item.total}`
          : "—";
      const note = item.analysis ? `\n   Earlier note: ${item.analysis}` : "";
      return `${i + 1}. ${item.date || ""} ${item.title || "Test"} ${item.subtitle ? `(${item.subtitle})` : ""} — ${score}${note}`;
    })
    .join("\n");

  if (lang === "en") {
    return `You are a friendly primary-school STEM tutor writing a monthly note for a parent.

Student: ${studentName || "the student"}
Month: ${month || "this month"}

Tests and saved notes:
${lines || "(none)"}

Write in simple English for parents of P4–P6 students.
Structure:
1) One sentence on how the month went.
2) "Needs more practice:" topics that came up as weak across these tests.
3) "What to do next:" 3–5 concrete study tips.
Under 250 words. No # headings. Only use the tests listed. Be encouraging.`;
  }

  return `你是親切的小學 STEM 導師，要寫給家長的「本月學習總結」。

學生：${studentName || "學生"}
月份：${month || "本月"}

本月測驗與已儲存的分析：
${lines || "（沒有紀錄）"}

請用繁體中文、家長看得懂的簡單句子。結構：
1）一句話總結這個月。
2）「需要加強：」綜合這些測驗，列出還不穩的課題。
3）「建議下一步：」寫 3–5 個具體複習建議。
全篇約 250 字以內。不要用 # 標題。只根據上面的紀錄，不要虛構測驗。語氣鼓勵。`;
}

/** @param {Array<{ correct?: boolean, question?: string, chosen?: string, expected?: string, prompt?: string }>} answers */
export function wrongItemsFromAnswers(answers) {
  if (!Array.isArray(answers)) return [];
  return answers
    .map((row, i) => ({ row, index: i + 1 }))
    .filter(({ row }) => row && row.correct === false)
    .map(({ row, index }) => ({
      index,
      question: row.question || row.prompt || `Question ${index}`,
      chosen:
        row.chosen != null && String(row.chosen).trim() !== ""
          ? String(row.chosen)
          : "(blank / timed out)",
      expected:
        row.expected != null && String(row.expected).trim() !== ""
          ? String(row.expected)
          : "(see lesson)",
    }));
}

async function callGeminiDirect(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data?.error?.message || data?.message || `Gemini HTTP ${response.status}`,
    );
  }
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join("\n")
    .trim();
  if (!text) throw new Error("Empty Gemini response");
  return text;
}

/**
 * @returns {Promise<string|null>} analysis text, or null if unavailable
 */
export async function analyzeQuizWithGemini(payload) {
  const body = {
    lang: payload.lang || "zh",
    studentName: payload.studentName || "",
    title: payload.title || "",
    subtitle: payload.subtitle || "",
    score: Number(payload.score) || 0,
    total: Number(payload.total) || 0,
    pct: Number(payload.pct) || 0,
    wrongItems:
      payload.wrongItems || wrongItemsFromAnswers(payload.answers || []),
  };

  try {
    const res = await fetch("/.netlify/functions/analyze-quiz-report", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.analysis) return String(data.analysis).trim();
    }
  } catch {
    /* fall through to direct key for local Vite */
  }

  const localKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!localKey) return null;

  try {
    return await callGeminiDirect(localKey, buildPrompt(body));
  } catch (err) {
    console.warn("Gemini analysis failed", err);
    return null;
  }
}

/** Monthly parent summary from saved analyses and practice scores. */
export async function analyzeMonthWithGemini(payload) {
  const body = {
    mode: "month",
    lang: payload.lang || "zh",
    studentName: payload.studentName || "",
    month: payload.month || "",
    tests: Array.isArray(payload.tests) ? payload.tests.slice(0, 40) : [],
  };

  try {
    const res = await fetch("/.netlify/functions/analyze-quiz-report", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.analysis) return String(data.analysis).trim();
    }
  } catch {
    /* local Vite fallback */
  }

  const localKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!localKey) return null;
  try {
    return await callGeminiDirect(localKey, buildMonthPrompt(body));
  } catch (err) {
    console.warn("Monthly Gemini analysis failed", err);
    return null;
  }
}
