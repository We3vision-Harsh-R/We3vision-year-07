import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("australia");

export default function Page() {
  return <PolicyPage slug="australia" />;
}
