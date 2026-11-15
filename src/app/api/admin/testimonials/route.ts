import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
    listTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from "@/lib/db";

export async function GET() {
    try {
        await requireAdmin();
        const testimonials = await listTestimonials();
        return NextResponse.json(testimonials);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        if (!body.id || !body.quote || !body.author) {
            return NextResponse.json({ error: "id, quote, and author are required" }, { status: 400 });
        }
        const testimonial = await createTestimonial({
            id: body.id,
            quote: body.quote,
            quoteBn: body.quoteBn ?? "",
            author: body.author,
            authorBn: body.authorBn ?? "",
            role: body.role ?? "",
            roleBn: body.roleBn ?? "",
        });
        return NextResponse.json(testimonial, { status: 201 });
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
        const testimonial = await updateTestimonial(id, rest);
        return NextResponse.json(testimonial);
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
        await deleteTestimonial(id);
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg === "Unauthorized" || msg.includes("admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
