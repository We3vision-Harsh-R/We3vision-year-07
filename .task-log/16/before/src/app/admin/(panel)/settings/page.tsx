import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/cms/queries";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const site = await getSiteSettings();
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Header menu, contact details and footer shown on every page. Saving updates the live website immediately.</p>
      </div>
      <SettingsForm initial={site} />
    </div>
  );
}
