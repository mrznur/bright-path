import { NextResponse } from 'next/server';
import { listBookings, updateBookingStatus } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-api';

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await listBookings());
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: `Unable to access bookings: ${error instanceof Error ? error.message : String(error)}` }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!body.id || !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'A valid id and status are required.' }, { status: 400 });
    }
    await updateBookingStatus(String(body.id), String(body.status));
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: `Unable to update booking: ${error instanceof Error ? error.message : String(error)}` }, { status: 503 });
  }
}
