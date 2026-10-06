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
}) {
  const name = studentName || (lang === "en" ? "Your child" : "您的孩子");
  const whenText = when || new Date().toLocaleString(lang === "en" ? "en-US" : "zh-HK");
  if (lang === "en") {
    return [
      `Hello,`,
      ``,
      `${name} finished a test on CodeKids STEM Lab.`,
      ``,
      `Test: ${title}${subtitle ? ` (${subtitle})` : ""}`,
      `Score: ${score} / ${total} (${pct}%)`,
      `Time: ${whenText}`,
      ``,
      `This is an automatic note from CodeKids. You do not need to reply.`,
    ].join("\n");
  }
  return [
    `您好，`,
    ``,
    `${name} 在 CodeKids STEM Lab 完成了一次測驗。`,
    ``,
    `測驗：${title}${subtitle ? `（${subtitle}）` : ""}`,
    `成績：${score} / ${total}（${pct}%）`,
    `時間：${whenText}`,
    ``,
    `這是系統自動通知，無需回覆。`,
  ].join("\n");
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
