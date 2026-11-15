import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { listBookings, updateBookingStatus, deleteBooking } from "@/lib/db";

export async function GET() {
    try {
        await requireAdmin();
        const bookings = await listBookings();
        return NextResponse.json(bookings);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function PATCH(request: Request) {
    try {
        await requireAdmin();
        const { id, status } = await request.json();
        await updateBookingStatus(id, status);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await requireAdmin();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        await deleteBooking(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
