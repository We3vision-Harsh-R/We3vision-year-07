// Tells the search engines about the whole website right now (run it once after every big release, or after the first launch):
//   npx tsx tools/seo-submit.ts            -> IndexNow gets every address of the sitemap, Google gets the sitemap again, jobs go to the Indexing API
//   npx tsx tools/seo-submit.ts /blog/x    -> only these paths
// The keys come from the environment (.env): INDEXNOW_KEY, GOOGLE_SERVICE_ACCOUNT_JSON, GSC_SITE_URL, NEXT_PUBLIC_SITE_URL. Nothing is printed
// except what each engine answered.
import { notifySearchEngines, siteBase } from "../src/lib/seo-ping";

async function main() {
  const base = siteBase();
  let paths = process.argv.slice(2);
  if (paths.length === 0) {
    const res = await fetch(`${base}/sitemap.xml`);
    const xml = await res.text();
    paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    console.log(`Read ${paths.length} addresses from ${base}/sitemap.xml`);
  }
  const results = await notifySearchEngines(paths);
  for (const r of results) console.log(`${r.ok ? "OK  " : "SKIP"} ${r.engine}: ${r.note}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
