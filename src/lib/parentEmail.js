const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isValidEmail(value) {
  return EMAIL_RE.test(normalizeEmail(value));
}

export function buildParentResultMessage({
  lang,
  studentName,
  title,
  subtitle,
  score,
  total,
  pct,
  when,
  analysis,
}) {
  const name = studentName || (lang === "en" ? "Your child" : "您的孩子");
  const whenText = when || new Date().toLocaleString(lang === "en" ? "en-US" : "zh-HK");
  const tip = String(analysis || "").trim();
  if (lang === "en") {
    const lines = [
      `Hello,`,
      ``,
      `${name} finished a test on CodeKids STEM Lab.`,
      ``,
      `Test: ${title}${subtitle ? ` (${subtitle})` : ""}`,
      `Score: ${score} / ${total} (${pct}%)`,
      `Time: ${whenText}`,
    ];
    if (tip) {
      lines.push(``, `AI study tips (Gemini):`, tip);
    }
    lines.push(``, `This is an automatic note from CodeKids. You do not need to reply.`);
    return lines.join("\n");
  }
  const lines = [
    `您好，`,
    ``,
    `${name} 在 CodeKids STEM Lab 完成了一次測驗。`,
    ``,
    `測驗：${title}${subtitle ? `（${subtitle}）` : ""}`,
    `成績：${score} / ${total}（${pct}%）`,
    `時間：${whenText}`,
  ];
  if (tip) {
    lines.push(``, `AI 學習建議（Gemini）：`, tip);
  }
  lines.push(``, `這是系統自動通知，無需回覆。`);
  return lines.join("\n");
}

export async function sendParentResultEmail({
  to,
  lang = "zh",
  studentName,
  title,
  subtitle,
  score,
  total,
  pct,
  analysis,
}) {
  const email = normalizeEmail(to);
  if (!isValidEmail(email)) {
    throw new Error("invalid-parent-email");
  }
  const subject =
    lang === "en"
      ? `CodeKids: ${studentName || "Your child"} finished a test (${score}/${total})`
      : `CodeKids：${studentName || "您的孩子"} 完成測驗（${score}/${total}）`;
  const message = buildParentResultMessage({
    lang,
    studentName,
    title,
    subtitle,
    score,
    total,
    pct,
    analysis,
    when: new Date().toLocaleString(lang === "en" ? "en-US" : "zh-HK"),
  });

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(email)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "box",
        _captcha: "false",
        name: studentName || "CodeKids student",
        message,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("parent-email-failed");
  }
  const data = await response.json().catch(() => ({}));
  if (data.success === "false" || data.success === false) {
    throw new Error("parent-email-failed");
  }
  return true;
}

export async function sendParentMonthlyEmail({
  to,
  lang = "zh",
  studentName,
  month,
  testCount,
  analysis,
}) {
  const email = normalizeEmail(to);
  if (!isValidEmail(email)) {
    throw new Error("invalid-parent-email");
  }
  const name = studentName || (lang === "en" ? "Your child" : "您的孩子");
  const subject =
    lang === "en"
      ? `CodeKids: ${name} — ${month} learning summary`
      : `CodeKids：${name} ${month} 學習總結`;
  const message =
    lang === "en"
      ? [
          `Hello,`,
          ``,
          `${name} finished ${testCount} test(s) on CodeKids STEM Lab in ${month}.`,
          ``,
          `Monthly study tips (Gemini):`,
          analysis || "(No analysis)",
          ``,
          `This is an automatic note from CodeKids. You do not need to reply.`,
        ].join("\n")
      : [
          `您好，`,
          ``,
          `${name} 在 ${month} 於 CodeKids STEM Lab 完成了 ${testCount} 次測驗。`,
          ``,
          `本月學習建議（Gemini）：`,
          analysis || "（沒有分析）",
          ``,
          `這是系統自動通知，無需回覆。`,
        ].join("\n");

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(email)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "box",
        _captcha: "false",
        name: studentName || "CodeKids student",
        message,
      }),
    },
  );
  if (!response.ok) throw new Error("parent-email-failed");
  const data = await response.json().catch(() => ({}));
  if (data.success === "false" || data.success === false) {
    throw new Error("parent-email-failed");
  }
  return true;
}
