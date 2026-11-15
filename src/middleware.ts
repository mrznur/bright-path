import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "brightpath_admin_session";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only guard /admin routes (but not /admin/login itself)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const session = request.cookies.get(ADMIN_COOKIE)?.value;
        if (!session) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
