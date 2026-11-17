// Shared by every page src/app/(site)/privacy-policy-<country>/page.tsx: the metadata and the page of one region.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/json-ld";
import { PolicyView, type PolicyVariant } from "@/components/site/privacy/policy-view";
import { SHARE_IMAGE } from "@/lib/share-image";
import { siteBase } from "@/lib/seo-ping";
import { breadcrumbNode, organizationRef, webPageNode, websiteNode } from "@/lib/seo/schema";
import { policySections } from "./common";
import { EN_UI, LANGS_BY_REGION } from "./i18n";
import { POLICY_UPDATED, POLICY_VERSION, REGIONS, regionBySlug, regionPath } from "./regions";

export function policyMetadata(slug: string): Metadata {
  const r = regionBySlug(slug);
  if (!r) return {};
  const title = `${r.title} | We3vision`;
  const description = `How We3vision Private Limited handles, stores and uses personal data and client project data: ${r.name === "all countries" ? "general policy for India and the world" : `rules for ${r.name}`}.`;
  return {
    title,
    description,
    alternates: { canonical: regionPath(r) },
    openGraph: { type: "website", url: regionPath(r), locale: "en_IN", title, description, images: [SHARE_IMAGE] },
  };
}

export function PolicyPage({ slug }: { slug: string }) {
  const r = regionBySlug(slug);
  if (!r) notFound();
  const base = siteBase();
  const url = `${base}${regionPath(r)}`;
  const ld = [
    organizationRef(),
    websiteNode(),
    breadcrumbNode(url, [
      { name: "Home", url: `${base}/` },
      { name: "Privacy Policy", url: `${base}/privacy-policy-general` },
      { name: r.tag, url },
    ]),
    webPageNode({ url, name: `${r.title} | We3vision` }),
  ];
  const english = policySections(r);
  const variants: PolicyVariant[] = [
    { code: "en", label: "English", ui: EN_UI, title: r.title, intro: r.intro, laws: r.laws, sections: english },
    ...(LANGS_BY_REGION[r.slug] ?? []).map((l) => {
      const tr = l.regions[r.slug];
      return {
        code: l.code,
        label: l.label,
        dir: l.dir,
        ui: l.ui,
        title: tr?.title ?? r.title,
        intro: tr?.intro ?? r.intro,
        laws: tr?.laws ?? r.laws,
        sections: english.map((sec) => { const t = tr?.sections[sec.id] ?? l.common[sec.id]; return t ? { id: sec.id, ...t } : sec; }),
      };
    }),
  ];
  return (
    <>
      <JsonLd graph={ld} />
      <PolicyView
        version={POLICY_VERSION}
        updated={POLICY_UPDATED}
        tags={REGIONS.map((x) => ({ href: regionPath(x), tag: x.tag, code: x.code, on: x.slug === r.slug }))}
        variants={variants}
      />
    </>
  );
}
