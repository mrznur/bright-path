import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

/**
 * Server-side guard for admin API routes.
 * Throws if the request does not carry a valid admin session cookie.
 */
export async function requireAdmin(): Promise<{ email: string }> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) throw new Error("No admin session cookie");
    return verifyAdminSession(token);
}
