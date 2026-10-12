// Creates (or updates) the first admin login, puts the sliding photos of the Brand Design page into Projects and the first people of the
// office into Team (each only when there are none yet).
// Run once after the database migration:
//   npm run db:seed        (reads ADMIN_EMAIL, ADMIN_PASSWORD, optional ADMIN_NAME from .env)
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { ADMIN_DOMAIN, isCompanyEmail } from "../src/lib/admin-access";
import { SHOWCASE } from "../src/lib/cms/content/brand";
import { TEAM_MEMBERS } from "../src/lib/cms/content/team";

try {
  process.loadEnvFile(".env");
} catch {
  // variables may come from the environment instead
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin";
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL first.");
  if (!email || !isCompanyEmail(email)) throw new Error(`Set ADMIN_EMAIL to an email address ending in @${ADMIN_DOMAIN}.`);
  if (!password || password.length < 12) throw new Error("Set ADMIN_PASSWORD to at least 12 characters.");

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url, max: 1 }) });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.adminUser.upsert({
      where: { email },
      create: { email, name, passwordHash },
      update: { name, passwordHash },
    });
    console.log(`Admin ready: ${email}`);
    if ((await db.project.count()) === 0) {
      await db.project.createMany({
        data: SHOWCASE.map((item, i) => ({
          slug: `project-${String(i + 1).padStart(2, "0")}`,
          title: item.title,
          category: item.category,
          summary: item.text,
          content: "",
          cover: item.image,
          images: [],
          group: "brand",
          sortOrder: i + 1,
          published: true,
          updatedAt: new Date(),
        })),
      });
      console.log(`Projects: ${SHOWCASE.length} placeholder projects added (replace them in the admin panel).`);
    }
    if ((await db.teamMember.count()) === 0) {
      await db.teamMember.createMany({
        data: TEAM_MEMBERS.map((m, i) => ({ name: m.name, role: m.role, dept: m.dept, bio: m.bio, photo: m.photo, linkedin: m.linkedin, girl: m.girl === "yes", sortOrder: i + 1, updatedAt: new Date() })),
      });
      console.log(`Team: ${TEAM_MEMBERS.length} people added (edit them in the admin panel, Team).`);
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
