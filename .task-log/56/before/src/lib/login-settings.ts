import "server-only";
import { db, hasDb } from "@/lib/db";
import { DEFAULT_LOGIN_IMAGE, LOGIN_SETTING_KEY, cleanLoginImage } from "@/lib/admin-access";

/** The picture of the login page: the one chosen in the admin panel (Admin access), or the default. */
export async function getLoginImage(): Promise<string> {
  if (!hasDb) return DEFAULT_LOGIN_IMAGE;
  try {
    const row = await db.setting.findUnique({ where: { key: LOGIN_SETTING_KEY } });
    const image = cleanLoginImage((row?.value as { image?: unknown } | null)?.image);
    return image || DEFAULT_LOGIN_IMAGE;
  } catch {
    return DEFAULT_LOGIN_IMAGE;
  }
}
