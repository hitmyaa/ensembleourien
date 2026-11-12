import { createHash } from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "admin_session";

export function tokenFor(password) {
  return createHash("sha256").update("ensembleourien:" + password).digest("hex");
}

export async function isAdmin() {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === tokenFor(pwd);
}
