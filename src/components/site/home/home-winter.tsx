"use client";

import dynamic from "next/dynamic";
import { WINTER_ON } from "@/lib/winter";
import { isLite } from "@/lib/lite";

// the winter world of the products grid (task 154): its own chunk, fetched after the page is up, and only while WINTER_ON is true
const World = dynamic(() => import("./home-winter-world").then((m) => m.HomeWinterWorld), { ssr: false });

export function HomeWinter() {
  return WINTER_ON && !isLite() ? <World /> : null;
}
