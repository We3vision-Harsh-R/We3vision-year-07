import { redirect } from "next/navigation";
import { LoginScreen } from "@/components/admin/login-screen";
import { getAdmin } from "@/lib/auth";
import { getLoginImage } from "@/lib/login-settings";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return <LoginScreen image={await getLoginImage()} />;
}
