export const ADMIN_EMAILS = [
  "st1556192@cskphc.edu.mo",
  "st1555410@cskphc.edu.mo",
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(String(email).trim().toLowerCase());
}

export function formatTokenDisplay(email, tokens) {
  if (isAdminEmail(email)) return "∞";
  return String(Number(tokens) || 0);
}

