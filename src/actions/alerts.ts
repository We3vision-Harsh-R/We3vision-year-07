"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { type AlertCheck, checkAlert } from "@/lib/alert-check";
import { editAlerts, readAlerts } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { sendWhatsApp, whatsappProvider } from "@/lib/whatsapp";

// Admin > Alerts: read, remove and test. Every action checks the login first.
const id = (formData: FormData) => String(formData.get("id") ?? "").slice(0, 40);

export async function markAlertRead(formData: FormData) {
  await requireAdmin();
  const target = id(formData);
  await editAlerts((items) => items.map((a) => (a.id === target ? { ...a, read: true } : a)));
  revalidatePath("/admin", "layout");
}

export async function deleteAlert(formData: FormData) {
  await requireAdmin();
  const target = id(formData);
  await editAlerts((items) => items.filter((a) => a.id !== target));
  revalidatePath("/admin", "layout");
}

export async function markAllAlertsRead() {
  await requireAdmin();
  await editAlerts((items) => items.map((a) => (a.read ? a : { ...a, read: true })));
  revalidatePath("/admin", "layout");
}

/** removes the alerts that are already read (unread ones stay, so nothing new is lost by a click) */
export async function clearReadAlerts() {
  await requireAdmin();
  await editAlerts((items) => items.filter((a) => !a.read));
  revalidatePath("/admin", "layout");
}

export async function sendTestWhatsApp() {
  const admin = await requireAdmin();
  if (!whatsappProvider()) redirect("/admin/alerts?test=off");
  if (!rateLimit(`wa-test:${admin.id}`, 5, 10 * 60_000)) redirect("/admin/alerts?test=wait");
  const res = await sendWhatsApp(`✅ Test message from the We3vision admin panel (sent by ${admin.email}). WhatsApp alerts are working.`);
  redirect(`/admin/alerts?test=${res.ok ? "ok" : "fail"}`);
}

/** "Check again": tries the failed thing once more (see lib/alert-check.ts) and tells the screen what happened. Nothing is changed. */
export async function recheckAlert(alertId: string): Promise<AlertCheck> {
  const admin = await requireAdmin();
  if (!rateLimit(`alert-check:${admin.id}`, 20, 60_000)) return { state: "unknown", message: "Too many checks in a minute. Please wait a little." };
  const alert = (await readAlerts()).find((a) => a.id === String(alertId).slice(0, 40));
  if (!alert) return { state: "unknown", message: "This alert is not in the list any more." };
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim() || (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  if (!host) return { state: "unknown", message: "The address of the website is not known, so the page cannot be opened." };
  const cookie = (await cookies()).toString();
  return checkAlert(alert, `${proto}://${host}`, cookie);
}

/** "Solved": the owner checked it. The alert is marked read and solved (it stays in the list, in the Solved filter, until deleted). */
export async function solveAlert(alertId: string) {
  await requireAdmin();
  const target = String(alertId).slice(0, 40);
  await editAlerts((items) => items.map((a) => (a.id === target ? { ...a, read: true, resolved: true } : a)));
  revalidatePath("/admin", "layout");
}
