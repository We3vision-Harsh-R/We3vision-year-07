import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="bg-brand-gradient mx-auto grid size-12 place-items-center rounded-2xl font-display text-xl font-bold text-white">W</span>
          <h1 className="mt-4 text-2xl font-bold">Admin login</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to manage the website.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
