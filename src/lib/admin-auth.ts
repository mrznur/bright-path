import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "brightpath_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours in seconds

function getSecret(): Uint8Array {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) throw new Error("ADMIN_JWT_SECRET env var is not set");
    return new TextEncoder().encode(secret);
}

export function getAdminCredentials() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD env vars must be set");
    }
    return { email, password };
}

export async function createAdminSession(email: string): Promise<string> {
    const secret = getSecret();
    return new SignJWT({ email, role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${ADMIN_SESSION_MAX_AGE}s`)
        .sign(secret);
}

export async function verifyAdminSession(token: string): Promise<{ email: string }> {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin" || typeof payload.email !== "string") {
        throw new Error("Invalid admin token");
    }
    return { email: payload.email };
}
