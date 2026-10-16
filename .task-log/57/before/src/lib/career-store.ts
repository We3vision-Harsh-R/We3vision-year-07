"use client";

import { useSyncExternalStore } from "react";

// What the first screen of the Careers page (the ticket office) tells the last section (Surat Junction): where the journey is.
//   idle      nothing booked; no train anywhere on the page
//   departing the passenger details are in: the train leaves the first station
//   arriving  the train comes into Surat Junction (the last section)
//   arrived   the train stands there and the passenger gets out and walks to the office
export type CareerStage = "idle" | "departing" | "arriving" | "arrived";
export type CareerState = { stage: CareerStage; name: string; role: string; city: string };

let state: CareerState = { stage: "idle", name: "", role: "", city: "" };
const listeners = new Set<() => void>();

export function setCareer(patch: Partial<CareerState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function useCareer(): CareerState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
