import type { Metadata } from "next";
import { renderMobileBlogPost, mobileBlogMetadata } from "@/components/site/mobile/pages/detail";

// The mobile blogpost page (served to phones and tablets at /blog/<address>, see src/lib/device.ts). Same content as the laptop page.
export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return mobileBlogMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return renderMobileBlogPost((await params).slug);
}
