import { redirect } from "next/navigation";

// /industrial-training has no page of its own: the three lengths (3, 6, 9 months) are the pages. Start with the first.
export default function Page() {
  redirect("/industrial-training/3-month");
}
