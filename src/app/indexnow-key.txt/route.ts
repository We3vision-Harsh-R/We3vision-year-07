// IndexNow asks for a text file that contains the key, to prove that the website is yours (the key is in the environment, INDEXNOW_KEY).
export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
