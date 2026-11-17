import { permanentRedirect } from "next/navigation";

// /privacy-policy is the short address: it opens the general policy (the country pages are /privacy-policy-usa, /privacy-policy-germany ...)
export default function Page() {
  permanentRedirect("/privacy-policy-general");
}
