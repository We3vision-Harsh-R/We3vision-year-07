import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("germany");

export default function Page() {
  return <PolicyPage slug="germany" />;
}
