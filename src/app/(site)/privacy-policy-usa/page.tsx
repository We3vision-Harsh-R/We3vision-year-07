import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("usa");

export default function Page() {
  return <PolicyPage slug="usa" />;
}
