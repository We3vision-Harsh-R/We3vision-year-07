import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("uk");

export default function Page() {
  return <PolicyPage slug="uk" />;
}
