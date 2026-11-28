import { AccessMatrix, AccountsCard, LoginPictureCard, type AccountRow, type BlockedRow } from "@/components/admin/access-panel";
import { ADMIN_ACCOUNTS, DEFAULT_LOGIN_IMAGE, isMasterEmail } from "@/lib/admin-access";
import { readGrants } from "@/lib/admin-permissions";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLoginImage } from "@/lib/login-settings";

export const metadata = { title: "Admin access" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

// Only a master admin (Admin@ or Harsh@) opens this screen. It shows the three accounts of the panel, and which screens the team member (Parth@) may open.
export default async function AccessPage() {
  const me = await requireSuperAdmin();
  const [users, image, grants] = await Promise.all([db.adminUser.findMany({ orderBy: { createdAt: "asc" } }), getLoginImage(), readGrants()]);
  const byEmail = new Map(users.map((u) => [u.email.toLowerCase(), u]));
  const rows: AccountRow[] = ADMIN_ACCOUNTS.map((a) => {
    const u = byEmail.get(a.email);
    return {
      email: a.email,
      name: a.name,
      isSuper: isMasterEmail(a.email),
      id: u?.id ?? null,
      lastLogin: u ? (u.lastLoginAt ? fmt.format(u.lastLoginAt) : "never") : "",
      isMe: u?.id === me.id,
    };
  });
  const allowed = new Set<string>(ADMIN_ACCOUNTS.map((a) => a.email));
  const blocked: BlockedRow[] = users.filter((u) => !allowed.has(u.email.toLowerCase())).map((u) => ({ id: u.id, email: u.email }));
  const members = rows.filter((r) => !r.isSuper).map((r) => ({ email: r.email, name: r.name }));

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin access</h1>
        <p className="mt-1 text-sm text-zinc-500">
          The three accounts of this panel, which screens the team member may open, and the picture of the login page. Only the two master admins see this screen.
        </p>
      </div>
      <AccountsCard rows={rows} blocked={blocked} />
      <AccessMatrix members={members} initial={Object.fromEntries(members.map((m) => [m.email, grants[m.email] ?? []]))} />
      <LoginPictureCard current={image} isDefault={image === DEFAULT_LOGIN_IMAGE} />
    </div>
  );
}
