import { LoginPictureCard, UsersCard, type AdminRow } from "@/components/admin/access-panel";
import { DEFAULT_LOGIN_IMAGE } from "@/lib/admin-access";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLoginImage } from "@/lib/login-settings";

export const metadata = { title: "Admin access" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function AccessPage() {
  const me = await requireAdmin();
  const [users, image] = await Promise.all([db.adminUser.findMany({ orderBy: { createdAt: "asc" } }), getLoginImage()]);
  const rows: AdminRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    lastLogin: u.lastLoginAt ? fmt.format(u.lastLoginAt) : "never",
    isMe: u.id === me.id,
  }));
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin access</h1>
        <p className="mt-1 text-sm text-zinc-500">The picture of the login page, and the people who can sign in to this admin panel.</p>
      </div>
      <LoginPictureCard current={image} isDefault={image === DEFAULT_LOGIN_IMAGE} />
      <UsersCard rows={rows} />
    </div>
  );
}
