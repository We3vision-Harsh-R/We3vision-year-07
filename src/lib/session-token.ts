import { SignJWT, jwtVerify } from "jose";

// Shared by proxy.ts (edge-light check) and lib/auth.ts. No DB / next/headers imports here.
export const SESSION_COOKIE = "w3_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30; // "Remember for 30 days" on the login page

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be set to a random string of 32+ characters.");
  return new TextEncoder().encode(value);
}

export async function signSession(userId: string, maxAge = SESSION_MAX_AGE, ver = "") {
  return new SignJWT(ver ? { v: ver } : {})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(secret());
}

/** Returns the admin user id, or null if the token is missing/invalid/expired. */
export async function verifySession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/** The admin user id and the password fingerprint inside the token, or null if the token is missing/invalid/expired. */
export async function readSession(token: string | undefined): Promise<{ userId: string; v: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload.sub ? { userId: payload.sub, v: typeof payload.v === "string" ? payload.v : "" } : null;
  } catch {
    return null;
  }
}
