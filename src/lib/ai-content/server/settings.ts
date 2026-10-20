import "server-only";
import { db } from "@/lib/db";

// The switches of the AI integration, kept in the table Setting (key "aiIntegration") so the admin changes them in Admin > AI Integrations
// without a deploy. The environment variables are a second, stronger switch: AI_INTEGRATION=off and ALERT_AI=off always win.

export const AI_SETTING_KEY = "aiIntegration";

export type AiSettings = {
  /** MCP endpoint, tool sign-in and token use are allowed */
  enabled: boolean;
  /** a WhatsApp alert when an AI tool sends a new draft */
  alerts: boolean;
  /** true when the environment forces it off (the admin cannot switch it on) */
  forcedOff: boolean;
  forcedAlertsOff: boolean;
};

const envOff = (name: string) => (process.env[name] ?? "").trim().toLowerCase() === "off";

export async function getAiSettings(): Promise<AiSettings> {
  const row = await db.setting.findUnique({ where: { key: AI_SETTING_KEY } }).catch(() => null);
  const value = (row?.value && typeof row.value === "object" ? row.value : {}) as { enabled?: unknown; alerts?: unknown };
  const forcedOff = envOff("AI_INTEGRATION");
  const forcedAlertsOff = envOff("ALERT_AI");
  return { enabled: !forcedOff && value.enabled !== false, alerts: !forcedAlertsOff && value.alerts !== false, forcedOff, forcedAlertsOff };
}

export async function aiEnabled(): Promise<boolean> {
  return (await getAiSettings()).enabled;
}

export async function saveAiSettings(next: { enabled: boolean; alerts: boolean }): Promise<void> {
  const value = { enabled: next.enabled, alerts: next.alerts };
  await db.setting.upsert({ where: { key: AI_SETTING_KEY }, create: { key: AI_SETTING_KEY, value }, update: { value } });
}
