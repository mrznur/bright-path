import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { listFaqs, createFaq, updateFaq, deleteFaq } from "@/lib/db";

export async function GET() {
    try {
        await requireAdmin();
        const faqs = await listFaqs();
        return NextResponse.json(faqs);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        if (!body.id || !body.question || !body.answer) {
            return NextResponse.json({ error: "id, question, and answer are required" }, { status: 400 });
        }
        const faq = await createFaq({
            id: body.id,
            question: body.question,
            questionBn: body.questionBn ?? "",
            answer: body.answer,
            answerBn: body.answerBn ?? "",
            sortOrder: Number(body.sortOrder) || 0,
        });
        return NextResponse.json(faq, { status: 201 });
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
        const faq = await updateFaq(id, rest);
        return NextResponse.json(faq);
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
        await deleteFaq(id);
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg === "Unauthorized" || msg.includes("admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
