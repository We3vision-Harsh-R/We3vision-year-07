import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("canada");

export default function Page() {
  return <PolicyPage slug="canada" />;
}
