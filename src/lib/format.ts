/** Admin-facing date, always in Indian time so server (UTC) and browser agree. */
export function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(date);
}

/** "5 min ago", "3 h ago", "2 d ago", "4 mo ago": how long ago something happened, for lists in the admin panel. */
export function timeAgo(date: Date, now: number = Date.now()) {
  const m = Math.max(0, Math.round((now - date.getTime()) / 60_000));
  return m < 60 ? `${m || 1} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : m < 43200 ? `${Math.round(m / 1440)} d ago` : `${Math.round(m / 43200)} mo ago`;
}
