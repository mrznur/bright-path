import { NextResponse } from 'next/server';
import { createCourse, listCourses, deactivateCourse } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-api';

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await listCourses());
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: 'Unable to access the content database.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.title || !body.level || !body.classes || !body.subject || !Number.isInteger(body.monthlyFee)) {
      return NextResponse.json({ error: 'Title, level, class range, subject and a valid fee are required.' }, { status: 400 });
    }
    const course = await createCourse({
      title: String(body.title).trim(),
      titleBn: String(body.titleBn || body.title).trim(),
      level: String(body.level).trim(),
      classes: String(body.classes).trim(),
      subject: String(body.subject).trim(),
      description: String(body.description || '').trim(),
      monthlyFee: body.monthlyFee,
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: 'Unable to access the content database.' }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'Course id is required.' }, { status: 400 });
    await deactivateCourse(String(body.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: 'Unable to access the content database.' }, { status: 503 });
  }
}
