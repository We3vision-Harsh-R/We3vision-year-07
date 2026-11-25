import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { InterviewScheduleForm } from "@/components/admin/interview-schedule-form";
import { interviewDays, parseSlot } from "@/lib/careers-shared";
import { getInterviewSchedule } from "@/lib/careers";
import { db } from "@/lib/db";
import { PIPELINE } from "@/lib/hiring-shared";

export const metadata = { title: "Careers: interview schedule" };

type Booked = { id: string; name: string; role: string; phone: string; email: string; status: string; city: string; slot: string; at: Date | null };

const statusChip = (s: string) => PIPELINE.find((p) => p.value === s) ?? null;

/** Careers > Interview schedule: the interview slots that the candidates book on the Careers page, day by day, with the free windows. */
export default async function InterviewSchedulePage() {
  await requireAdmin();
  const [rows, schedule] = await Promise.all([db.careerApplication.findMany({ where: { callSlot: { not: "" } }, orderBy: { createdAt: "desc" }, take: 1500 }), getInterviewSchedule()]);
  const TIMES = schedule.times;
  const booked: Booked[] = rows.map((r) => ({
    id: r.id,
    name: r.name || "(details not given yet)",
    role: r.roleTitle,
    phone: r.phone,
    email: r.email,
    status: r.status,
    city: r.city,
    slot: r.callSlot,
    at: parseSlot(r.callSlot, r.createdAt)?.start ?? null,
  }));
  const live = booked.filter((b) => b.status !== "rejected");
  const bySlot = new Map<string, Booked[]>();
  for (const b of booked) bySlot.set(b.slot, [...(bySlot.get(b.slot) ?? []), b]);

  const days = interviewDays(new Date(), schedule);
  const shown = new Set<string>();
  for (const d of days) for (const t of TIMES) shown.add(`${d.label}, ${t}`);
  const now = new Date().getTime();
  const upcoming = live.filter((b) => b.at && b.at.getTime() >= now).length;
  const earlier = booked.filter((b) => !shown.has(b.slot)).sort((a, b) => (b.at?.getTime() ?? 0) - (a.at?.getTime() ?? 0));
  const weekEnd = now + 7 * 86_400_000;
  const thisWeek = live.filter((b) => b.at && b.at.getTime() >= now && b.at.getTime() <= weekEnd).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Careers: interview schedule</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            Set below when interviews can be booked. These are the slots that the candidates book on the Careers page. One candidate can book one window; a rejected application gives its window back. Times are India time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/careers" className={btnSecondary}>
            Applications
          </Link>
          <Link href="/admin/careers/jobs" className={btnPrimary}>
            Jobs
          </Link>
        </div>
      </div>

      <InterviewScheduleForm initial={schedule} />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Upcoming interviews", upcoming],
          ["In the next 7 days", thisWeek],
          [`Free windows (next ${schedule.daysAhead} days)`, days.length * TIMES.length - [...shown].filter((s) => (bySlot.get(s) ?? []).some((b) => b.status !== "rejected")).length],
        ].map(([k, v]) => (
          <div key={String(k)} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-bold">{v}</p>
            <p className="text-sm text-zinc-500">{k}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {days.map((d) => {
          const count = TIMES.filter((t) => (bySlot.get(`${d.label}, ${t}`) ?? []).some((b) => b.status !== "rejected")).length;
          return (
            <section key={d.iso} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <header className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
                <h2 className="text-sm font-semibold">{d.label}</h2>
                <span className="text-xs text-zinc-500">{count === 0 ? "All free" : `${count} of ${TIMES.length} booked`}</span>
              </header>
              <ul className="divide-y divide-zinc-100">
                {TIMES.map((t) => (
                  <Row key={t} time={t} items={bySlot.get(`${d.label}, ${t}`) ?? []} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {earlier.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <header className="border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
            <h2 className="text-sm font-semibold">Other and earlier bookings</h2>
          </header>
          <ul className="divide-y divide-zinc-100">
            {earlier.slice(0, 60).map((b) => (
              <Row key={b.id} time={b.slot} items={[b]} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Row({ time, items }: { time: string; items: Booked[] }) {
  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
      <span className="w-44 shrink-0 font-medium text-zinc-700">{time}</span>
      {items.length === 0 ? (
        <span className="text-emerald-700">Free</span>
      ) : (
        <div className="min-w-0 flex-1 space-y-1.5">
          {items.map((b) => {
            const chip = statusChip(b.status);
            return (
              <div key={b.id} className={b.status === "rejected" ? "opacity-50" : ""}>
                <Link href={`/admin/careers?open=${b.id}`} className="font-semibold text-zinc-900 hover:underline">
                  {b.name}
                </Link>
                {chip && <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${chip.chip}`}>{chip.label}</span>}
                <p className="text-zinc-500">
                  {[b.role, b.city].filter(Boolean).join(" · ")}
                  {b.phone && (
                    <>
                      {" · "}
                      <a href={`tel:${b.phone}`} className="hover:underline">
                        {b.phone}
                      </a>
                    </>
                  )}
                  {b.email && (
                    <>
                      {" · "}
                      <a href={`mailto:${b.email}`} className="hover:underline">
                        {b.email}
                      </a>
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </li>
  );
}
