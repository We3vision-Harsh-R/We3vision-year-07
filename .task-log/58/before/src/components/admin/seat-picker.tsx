"use client";

import { useState } from "react";
import { tierOf, type TeamPerson } from "@/lib/team-shared";
import {
  CSEAT,
  CXO_CAP,
  CZH,
  MAX_PODS,
  MGR_CAP,
  MGR_SEATS,
  MZH,
  MZW,
  POD_SEATS,
  TEAM_SEATS,
  TZH,
  TZW,
  cxoSlots,
  placeInSeats,
  podCount,
} from "@/lib/team-seats";
import { btnSecondary } from "./ui";

// The seat picker of the admin panel (Team): a small plan of the table(s) of the department of the person that is being edited. Click a chair
// and the person sits there (the person who was there is seated on another free chair). "Automatic" = the order of the list.

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

export function SeatPicker({ people, current, onAssign }: { people: TeamPerson[]; current: TeamPerson; onAssign: (seat: number) => void }) {
  const tier = tierOf(current.dept);
  const dept = current.dept.trim();
  const group = people.filter((p) => (tier === "team" ? p.dept.trim() === dept : tierOf(p.dept) === tier));
  const [extra, setExtra] = useState(0);

  // the seats of the group, with the person on each of them (the same rule as the office of the Team page)
  let slotCount: number;
  if (tier === "team") slotCount = Math.min(MAX_PODS, podCount(group) + extra) * POD_SEATS;
  else if (tier === "mgr") slotCount = MGR_CAP;
  else slotCount = Math.min(CXO_CAP, cxoSlots(group) + extra);
  const slots = placeInSeats(group, slotCount);
  const mine = slots.indexOf(current);
  const label = (i: number) => {
    if (tier === "team") return `Island ${Math.floor(i / POD_SEATS) + 1}, ${TEAM_SEATS[i % POD_SEATS].label.toLowerCase()}`;
    if (tier === "mgr") return MGR_SEATS[i].label;
    return `Leader seat ${i + 1}`;
  };

  const seat = (i: number, x: number, y: number, r = 14) => {
    const p = slots[i];
    const isMe = p === current;
    return (
      <g key={i} className="cursor-pointer" onClick={() => onAssign(i)}>
        <title>{p ? `${label(i)}: ${p.name}` : `${label(i)}: free`}</title>
        <circle cx={x} cy={y} r={r + 3} fill="transparent" />
        <circle
          cx={x}
          cy={y}
          r={r}
          fill={isMe ? "#7c5cff" : p ? "#d4d4d8" : "#ffffff"}
          stroke={isMe ? "#4c2fd1" : "#a1a1aa"}
          strokeWidth={isMe ? 3 : 1.5}
          strokeDasharray={p ? undefined : "4 3"}
        />
        {p && (
          <text x={x} y={y + 4} textAnchor="middle" fontSize={r > 14 ? 12 : 11} fontWeight={700} fill={isMe ? "#ffffff" : "#3f3f46"}>
            {initials(p.name)}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-zinc-700">
          Seat:{" "}
          <span className="font-normal text-zinc-500">
            {current.seat >= 0 && mine >= 0 ? label(mine) : mine >= 0 ? `automatic (${label(mine).toLowerCase()})` : "automatic"}
          </span>
        </p>
        <button type="button" className={btnSecondary} disabled={current.seat < 0} onClick={() => onAssign(-1)}>
          Automatic seat
        </button>
      </div>

      {tier === "team" && (
        <div className="space-y-3">
          {Array.from({ length: slotCount / POD_SEATS }, (_, k) => (
            <svg key={k} viewBox={`0 0 ${TZW} ${TZH}`} className="w-full max-w-[380px] rounded-xl border border-zinc-200 bg-zinc-50" aria-label={`Island ${k + 1}`}>
              <rect x="14" y="26" width="150" height="78" rx="8" fill="#e4e4e7" stroke="#a1a1aa" />
              <text x="89" y="70" textAnchor="middle" fontSize="11" fill="#71717a">
                wall board
              </text>
              <rect x="20" y="164" width="150" height="32" rx="8" fill="#d4d4d8" />
              <circle cx="232" cy="150" r="26" fill="#d4d4d8" />
              <text x="14" y="16" fontSize="11" fill="#71717a">
                Island {k + 1}
              </text>
              {TEAM_SEATS.map((s, j) => seat(k * POD_SEATS + j, s.x, s.y))}
            </svg>
          ))}
          {slotCount / POD_SEATS < MAX_PODS && (
            <button type="button" className={btnSecondary} onClick={() => setExtra((e) => e + 1)}>
              + Another island
            </button>
          )}
        </div>
      )}

      {tier === "mgr" && (
        <svg viewBox={`0 0 ${MZW} ${MZH}`} className="w-full max-w-[420px] rounded-xl border border-zinc-200 bg-zinc-50" aria-label="Managers table">
          <rect x="36" y="66" width="244" height="44" rx="10" fill="#d4d4d8" />
          <text x="158" y="92" textAnchor="middle" fontSize="11" fill="#71717a">
            managers&apos; table
          </text>
          {MGR_SEATS.map((s, i) => seat(i, s.x, s.y, s.kind === "h" ? 17 : 14))}
        </svg>
      )}

      {tier === "cxo" && (
        <div className="space-y-3">
          <svg viewBox={`0 0 ${slotCount * CSEAT} ${CZH}`} className="w-full max-w-[520px] rounded-xl border border-zinc-200 bg-zinc-50" aria-label="Desk of the leaders">
            <rect x="12" y="70" width={slotCount * CSEAT - 24} height="34" rx="10" fill="#d4d4d8" />
            {Array.from({ length: slotCount }, (_, i) => seat(i, CSEAT / 2 + i * CSEAT, 44, 18))}
          </svg>
          {slotCount < CXO_CAP && (
            <button type="button" className={btnSecondary} onClick={() => setExtra((e) => e + 1)}>
              + Another chair
            </button>
          )}
        </div>
      )}
      <p className="text-xs text-zinc-400">Click a chair to seat this person there. Chairs without a choice are filled in the order of the list.</p>
    </div>
  );
}
