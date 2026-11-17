import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("general");

export default function Page() {
  return <PolicyPage slug="general" />;
}
