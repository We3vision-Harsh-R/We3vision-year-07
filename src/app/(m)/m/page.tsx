import { redirect } from "next/navigation";

// The phone launcher is gone (owner, 2026-11-13): phones use the main pages. The old address /m goes to the home page.
export default function MobileHome() {
  redirect("/");
}
