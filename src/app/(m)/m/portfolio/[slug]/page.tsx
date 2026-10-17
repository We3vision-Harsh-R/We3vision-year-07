import type { Metadata } from "next";
import { renderMobileProject, mobileProjectMetadata } from "@/components/site/mobile/pages/detail";

// The mobile project page (served to phones and tablets at /portfolio/<address>, see src/lib/device.ts). Same content as the laptop page.
export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return mobileProjectMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return renderMobileProject((await params).slug);
}
