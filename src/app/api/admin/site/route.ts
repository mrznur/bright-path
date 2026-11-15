import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getSiteConfig, updateSiteConfig } from "@/lib/db";
import type { SiteConfig } from "@/types";

function adminError(err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg === "Unauthorized" || msg.includes("admin") || msg.includes("session")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
}

export async function GET() {
    try {
        await requireAdmin();
        return NextResponse.json(await getSiteConfig());
    } catch (err) {
        return adminError(err);
    }
}

export async function PATCH(request: Request) {
    try {
        await requireAdmin();
        const body = (await request.json()) as SiteConfig;
        if (!body.name) {
            return NextResponse.json({ error: "name is required" }, { status: 400 });
        }
        return NextResponse.json(await updateSiteConfig(body));
    } catch (err) {
        return adminError(err);
    }
}
