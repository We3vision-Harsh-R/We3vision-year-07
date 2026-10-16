import type { Metadata } from "next";
import "../globals.css";
import { RootShell, baseMetadata } from "@/lib/root-shell";

export const metadata: Metadata = {
  ...baseMetadata,
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

// ROOT LAYOUT of the admin panel (see src/lib/root-shell.tsx).
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell>
      <div className="min-h-screen bg-zinc-100 text-zinc-900">{children}</div>
    </RootShell>
  );
}
