// The website's AI chat, called PANDA (Professional AI Navigation & Digital Assistant): visitors ask about We3vision and the bot answers.
//
// >>> CONNECT THE BOT HERE. <<<
// `askBot` receives the whole conversation (last message = the visitor's question) and must resolve with the answer text.
// Until the bot is connected it answers with the contact details of the company (from the old site), so nobody is left
// without an answer. To connect the bot, replace the body with a `fetch` to your bot's endpoint (keep any secret key on
// the server, for example in a Next.js route handler, never in this file).

export type ChatMessage = { role: "user" | "assistant"; text: string };

export async function askBot(history: ChatMessage[]): Promise<string> {
  void history;
  await new Promise((resolve) => setTimeout(resolve, 700));
  return "PANDA is being connected. Until it is live, the team will gladly help you: info@we3vision.com or +91 7383216096 (Surat, India).";
}
