import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("uae");

export default function Page() {
  return <PolicyPage slug="uae" />;
}
