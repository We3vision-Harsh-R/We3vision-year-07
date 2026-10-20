import type { Metadata } from "next";
import "../globals.css";
import "@/styles/admin-shell.css";
import { RootShell, baseMetadata } from "@/lib/root-shell";

export const metadata: Metadata = {
  ...baseMetadata,
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

// ROOT LAYOUT of the admin panel (see src/lib/root-shell.tsx). ".ads" = the admin dress in the colours of the website (styles/admin-shell.css).
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell>
      <div className="ads min-h-screen">{children}</div>
    </RootShell>
  );
}
