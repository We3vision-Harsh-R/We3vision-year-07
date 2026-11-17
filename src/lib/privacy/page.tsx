// Shared by every page src/app/(site)/privacy-policy-<country>/page.tsx: the metadata and the page of one region.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/json-ld";
import { PolicyView } from "@/components/site/privacy/policy-view";
import { SHARE_IMAGE } from "@/lib/share-image";
import { siteBase } from "@/lib/seo-ping";
import { breadcrumbNode, organizationRef, webPageNode, websiteNode } from "@/lib/seo/schema";
import { policySections } from "./common";
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
  return (
    <>
      <JsonLd graph={ld} />
      <PolicyView
        title={r.title}
        intro={r.intro}
        updated={POLICY_UPDATED}
        version={POLICY_VERSION}
        tags={REGIONS.map((x) => ({ href: regionPath(x), tag: x.tag, code: x.code, on: x.slug === r.slug }))}
        laws={r.laws}
        sections={policySections(r)}
      />
    </>
  );
}
