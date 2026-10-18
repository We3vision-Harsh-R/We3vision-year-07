"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { editAlerts } from "@/lib/alerts";
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
