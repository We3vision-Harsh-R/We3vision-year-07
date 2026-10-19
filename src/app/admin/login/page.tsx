import { redirect } from "next/navigation";
import { LoginScreen } from "@/components/admin/login-screen";
import { getAdmin } from "@/lib/auth";
import { getLoginImage } from "@/lib/login-settings";
import { safeAdminNext } from "@/lib/safe-next";

export const metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeAdminNext((await searchParams).next);
  if (await getAdmin()) redirect(next);
  return <LoginScreen image={await getLoginImage()} next={next === "/admin" ? "" : next} />;
}
