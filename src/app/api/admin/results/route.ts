import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { listResults, createResult, updateResult, deleteResult } from "@/lib/db";

export async function GET() {
    try {
        await requireAdmin();
        const results = await listResults();
        return NextResponse.json(results);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        if (!body.id || !body.studentName || !body.exam || !body.grade) {
            return NextResponse.json({ error: "id, studentName, exam, and grade are required" }, { status: 400 });
        }
        const result = await createResult({
            id: body.id,
            studentName: body.studentName,
            studentNameBn: body.studentNameBn ?? "",
            exam: body.exam,
            examBn: body.examBn ?? "",
            subject: body.subject ?? "",
            subjectBn: body.subjectBn ?? "",
            grade: body.grade,
            gradeBn: body.gradeBn ?? "",
            year: Number(body.year) || new Date().getFullYear(),
        });
        return NextResponse.json(result, { status: 201 });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg === "Unauthorized" || msg.includes("admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { id, ...rest } = body;
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        const result = await updateResult(id, rest);
        return NextResponse.json(result);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg === "Unauthorized" || msg.includes("admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await requireAdmin();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        await deleteResult(id);
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg === "Unauthorized" || msg.includes("admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
