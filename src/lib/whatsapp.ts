import "server-only";

// Sends a WhatsApp message to the owner (alerts, new contact messages). Three ways, set in the server environment (Hostinger > Environment):
//   1) CallMeBot (free, for your own number):  ALERT_WHATSAPP_TO=91XXXXXXXXXX  CALLMEBOT_APIKEY=<key the bot sent you>
//      Get the key once: follow step 1 of https://www.callmebot.com/blog/free-api-whatsapp-messages/ (add their number, send the message).
//   2) WhatsApp Cloud API (Meta Business):     ALERT_WHATSAPP_TO, WHATSAPP_CLOUD_TOKEN, WHATSAPP_CLOUD_PHONE_ID
//      (Meta delivers a plain text only within 24 hours after your phone last wrote to the business number; otherwise it needs a template)
//   3) Any webhook (Make, Zapier, n8n ...):    ALERT_WEBHOOK_URL  (receives a POST with JSON { text })
// Nothing set = nothing is sent (the alerts are still kept in Admin > Alerts). It never throws and never waits more than 6 seconds.

const to = () => (process.env.ALERT_WHATSAPP_TO ?? "").replace(/[^\d]/g, "");

export type Provider = "callmebot" | "cloud" | "webhook";

export function whatsappProvider(): Provider | null {
  if (to() && process.env.CALLMEBOT_APIKEY) return "callmebot";
  if (to() && process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_CLOUD_PHONE_ID) return "cloud";
  if (process.env.ALERT_WEBHOOK_URL) return "webhook";
  return null;
}

export async function sendWhatsApp(text: string): Promise<{ ok: boolean; error?: string }> {
  const provider = whatsappProvider();
  if (!provider) return { ok: false, error: "WhatsApp is not set up (see Admin > Alerts)." };
  const body = text.slice(0, 1500);
  try {
    let res: Response;
    if (provider === "callmebot") {
      const url = `https://api.callmebot.com/whatsapp.php?phone=%2B${to()}&text=${encodeURIComponent(body)}&apikey=${encodeURIComponent(process.env.CALLMEBOT_APIKEY ?? "")}`;
      res = await fetch(url, { signal: AbortSignal.timeout(6000), cache: "no-store" });
    } else if (provider === "cloud") {
      res = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(process.env.WHATSAPP_CLOUD_PHONE_ID ?? "")}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to: to(), type: "text", text: { body } }),
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
      });
    } else {
      res = await fetch(process.env.ALERT_WEBHOOK_URL ?? "", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body }),
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
      });
    }
    if (!res.ok) return { ok: false, error: `The WhatsApp service answered ${res.status}.` };
    return { ok: true };
  } catch (error) {
    console.error("whatsapp send failed", error instanceof Error ? error.message : error);
    return { ok: false, error: "Could not reach the WhatsApp service." };
  }
}
