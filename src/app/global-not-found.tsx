import type { Metadata } from "next";
import { NotFoundView } from "@/components/site/not-found-view";
import { RootShell } from "@/lib/root-shell";

// The 404 for an address that matches no page at all (experimental.globalNotFound in next.config.ts). The site has several root layouts,
// so this file brings its own <html> (RootShell: Poppins + the visitor's saved colour) and only the small stylesheet of the 404 screen.
export const metadata: Metadata = {
  title: "Page Not Found | We3vision",
  description: "This page does not exist. Go back to the We3vision home page or contact us.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootShell>
      <main>
        <NotFoundView />
      </main>
    </RootShell>
  );
}
