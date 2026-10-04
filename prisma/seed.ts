// Creates (or updates) the first admin login. Run once after the database migration:
//   npm run db:seed        (reads ADMIN_EMAIL, ADMIN_PASSWORD, optional ADMIN_NAME from .env)
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

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
  if (!email || !email.includes("@")) throw new Error("Set ADMIN_EMAIL to a valid email.");
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
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
