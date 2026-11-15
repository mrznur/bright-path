import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { listTeachers, createTeacher, updateTeacher, deleteTeacher } from "@/lib/db";

export async function GET() {
    try {
        await requireAdmin();
        const teachers = await listTeachers();
        return NextResponse.json(teachers);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        if (!body.id || !body.name) {
            return NextResponse.json({ error: "id and name are required" }, { status: 400 });
        }
        const teacher = await createTeacher({
            id: body.id,
            name: body.name,
            nameBn: body.nameBn ?? "",
            subject: body.subject ?? "",
            subjectBn: body.subjectBn ?? "",
            bio: body.bio ?? "",
            bioBn: body.bioBn ?? "",
            imageUrl: body.imageUrl ?? undefined,
        });
        return NextResponse.json(teacher, { status: 201 });
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
        const teacher = await updateTeacher(id, rest);
        return NextResponse.json(teacher);
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
        await deleteTeacher(id);
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg === "Unauthorized" || msg.includes("admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
