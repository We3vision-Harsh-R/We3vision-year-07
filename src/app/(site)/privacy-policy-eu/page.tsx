import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("eu");

export default function Page() {
  return <PolicyPage slug="eu" />;
}
