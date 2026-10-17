import type { Metadata } from "next";
import { renderMobileJob, mobileJobMetadata } from "@/components/site/mobile/pages/detail";

// The mobile job page (served to phones and tablets at /careers/<address>, see src/lib/device.ts). Same content as the laptop page.
export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return mobileJobMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return renderMobileJob((await params).slug);
}
