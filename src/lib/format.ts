/** Admin-facing date, always in Indian time so server (UTC) and browser agree. */
export function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(date);
}
