"use client";

import { useSyncExternalStore } from "react";

// What the ticket office (the first screen of the Careers page), the railway that runs through the whole page (career/railway.tsx) and Surat
// Junction (the last section) tell each other:
//   idle      nothing booked yet
//   booked    the seat is booked: the passenger sits in the first coach and the train rides down the page with the scroll
//   departing the passenger details are in: the page rides to Surat Junction
//   arriving  the train comes into Surat Junction (the last section)
//   arrived   the train stands there and the passenger gets out and walks to the office
export type CareerStage = "idle" | "booked" | "departing" | "arriving" | "arrived";
export type CareerState = {
  stage: CareerStage;
  name: string;
  role: string;
  city: string;
  /** how many answers the passenger has given (0..steps): the passenger walks that many steps towards the train */
  step: number;
  steps: number;
  /** the city, the current status and the destination are chosen: the train comes */
  summoned: boolean;
  /** the passenger has a city (stands on the platform) */
  passenger: boolean;
};

let state: CareerState = { stage: "idle", name: "", role: "", city: "", step: 0, steps: 7, summoned: false, passenger: false };
const listeners = new Set<() => void>();

export function setCareer(patch: Partial<CareerState>) {
  let changed = false;
  for (const k of Object.keys(patch) as (keyof CareerState)[]) if (state[k] !== patch[k]) changed = true;
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getCareer(): CareerState {
  return state;
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
