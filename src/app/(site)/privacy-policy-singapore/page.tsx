import { PolicyPage, policyMetadata } from "@/lib/privacy/page";

export const metadata = policyMetadata("singapore");

export default function Page() {
  return <PolicyPage slug="singapore" />;
}
