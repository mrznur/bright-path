import { NextResponse } from 'next/server';
import { createBatch, listBatches, deactivateBatch } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-api';

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await listBatches());
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    if (error instanceof Error && error.message === 'COURSE_NOT_FOUND') return NextResponse.json({ error: 'Selected course was not found.' }, { status: 400 });
    return NextResponse.json({ error: 'Unable to access the content database.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const capacity = Number(body.capacity);
    if (!body.courseId || !body.teacherName || !body.days || !body.time || !Number.isInteger(capacity) || capacity < 1) {
      return NextResponse.json({ error: 'Course, teacher, days, time and a positive capacity are required.' }, { status: 400 });
    }
    const batch = await createBatch({
      courseId: String(body.courseId),
      teacherName: String(body.teacherName).trim(),
      days: String(body.days).trim(),
      time: String(body.time).trim(),
      capacity,
    });
    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: 'Unable to access the content database.' }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'Batch id is required.' }, { status: 400 });
    await deactivateBatch(String(body.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: 'Unable to access the content database.' }, { status: 503 });
  }
}
