import { AccessMatrix, AccountsCard, LoginPictureCard, type BlockedRow, type MasterRow, type MemberRow } from "@/components/admin/access-panel";
import { ADMIN_DOMAIN, DEFAULT_LOGIN_IMAGE, MASTER_ADMINS, isCompanyEmail, isMasterEmail } from "@/lib/admin-access";
import { readGrants } from "@/lib/admin-permissions";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLoginImage } from "@/lib/login-settings";

export const metadata = { title: "Admin access" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

// Only a master admin (Admin@, Harsh@ or Parth@) opens this screen. It shows the master admins, the team members (add / new password / remove),
// which screens each team member may open, and the login picture.
export default async function AccessPage() {
  const me = await requireSuperAdmin();
  const [users, image, grants] = await Promise.all([db.adminUser.findMany({ orderBy: { createdAt: "asc" } }), getLoginImage(), readGrants()]);
  const lastLogin = (u: { lastLoginAt: Date | null }) => (u.lastLoginAt ? fmt.format(u.lastLoginAt) : "never");
  const byEmail = new Map(users.map((u) => [u.email.toLowerCase(), u]));

  const masters: MasterRow[] = MASTER_ADMINS.map((a) => {
    const u = byEmail.get(a.email);
    return { email: a.email, name: a.name, id: u?.id ?? null, lastLogin: u ? lastLogin(u) : "", isMe: u?.id === me.id };
  });
  const members: MemberRow[] = users
    .filter((u) => isCompanyEmail(u.email) && !isMasterEmail(u.email))
    .map((u) => ({ id: u.id, email: u.email.toLowerCase(), name: u.name, lastLogin: lastLogin(u) }));
  const blocked: BlockedRow[] = users.filter((u) => !isCompanyEmail(u.email)).map((u) => ({ id: u.id, email: u.email }));

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin access</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Add a new user, change a password, choose which screens each team member may open, and set the picture of the login page. Only the master admins see this screen.
        </p>
      </div>
      <AccountsCard masters={masters} members={members} blocked={blocked} domain={ADMIN_DOMAIN} />
      <AccessMatrix members={members.map((m) => ({ email: m.email, name: m.name }))} initial={Object.fromEntries(members.map((m) => [m.email, grants[m.email] ?? []]))} />
      <LoginPictureCard current={image} isDefault={image === DEFAULT_LOGIN_IMAGE} />
    </div>
  );
}
