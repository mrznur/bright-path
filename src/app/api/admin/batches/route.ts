import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { listBatches, createBatch, updateBatch, deleteBatch } from "@/lib/db";

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
        return NextResponse.json(await listBatches());
    } catch (err) {
        return adminError(err);
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        if (!body.id || !body.courseId) {
            return NextResponse.json({ error: "id and courseId are required" }, { status: 400 });
        }
        const batch = await createBatch({
            id: body.id,
            courseId: body.courseId,
            days: body.days ?? "",
            daysBn: body.daysBn ?? "",
            time: body.time ?? "",
            timeBn: body.timeBn ?? "",
            batchSize: Number(body.batchSize) || 15,
            enrolledCount: Number(body.enrolledCount) || 0,
            isFull: Boolean(body.isFull),
        });
        return NextResponse.json(batch, { status: 201 });
    } catch (err) {
        return adminError(err);
    }
}

export async function PATCH(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { id, ...rest } = body;
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        return NextResponse.json(await updateBatch(id, rest));
    } catch (err) {
        return adminError(err);
    }
}

export async function DELETE(request: Request) {
    try {
        await requireAdmin();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        await deleteBatch(id);
        return NextResponse.json({ success: true });
    } catch (err) {
        return adminError(err);
    }
}
