import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { listCourses, createCourse, updateCourse, deleteCourse, createBatch } from "@/lib/db";
import type { Batch } from "@/types";

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
        const courses = await listCourses();
        return NextResponse.json(courses);
    } catch (err) {
        return adminError(err);
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        if (!body.id || !body.title || !body.level) {
            return NextResponse.json({ error: "id, title, and level are required" }, { status: 400 });
        }
        const course = await createCourse({
            id: body.id,
            title: body.title,
            titleBn: body.titleBn ?? "",
            level: body.level,
            levelBn: body.levelBn ?? "",
            classes: body.classes ?? "",
            classesBn: body.classesBn ?? "",
            subject: body.subject ?? "",
            subjectBn: body.subjectBn ?? "",
            description: body.description ?? "",
            descriptionBn: body.descriptionBn ?? "",
            teacherId: body.teacherId ?? "",
            monthlyFee: Number(body.monthlyFee) || 0,
        });
        if (body.batch && body.batch.id) {
            const b = body.batch as Partial<Batch>;
            await createBatch({
                id: b.id as string,
                courseId: course.id,
                days: b.days ?? "",
                daysBn: b.daysBn ?? "",
                time: b.time ?? "",
                timeBn: b.timeBn ?? "",
                batchSize: Number(b.batchSize) || 15,
                enrolledCount: Number(b.enrolledCount) || 0,
                isFull: Boolean(b.isFull),
            });
            const courses = await listCourses();
            return NextResponse.json(courses.find((c) => c.id === course.id) ?? course, { status: 201 });
        }
        return NextResponse.json(course, { status: 201 });
    } catch (err) {
        return adminError(err);
    }
}

export async function PATCH(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { id, batches: _batches, teacherName: _n, teacherNameBn: _nb, ...rest } = body;
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        const course = await updateCourse(id, rest);
        return NextResponse.json(course);
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
        await deleteCourse(id);
        return NextResponse.json({ success: true });
    } catch (err) {
        return adminError(err);
    }
}
