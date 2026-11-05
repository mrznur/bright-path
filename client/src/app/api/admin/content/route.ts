import { NextResponse } from 'next/server';
import { createFaq, createTeacher, createTestimonial, getAdminContent, updateFaq, updateSiteSettings, updateTeacher, updateTestimonial } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-api';

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await getAdminContent());
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: `Unable to access content: ${error instanceof Error ? error.message : String(error)}` }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as { type?: string; data?: Record<string, unknown> };
    if (!body.type || !body.data) {
      return NextResponse.json({ error: 'Content type and data are required.' }, { status: 400 });
    }
    const data = body.data;
    if (body.type === 'teacher') {
      const teacher = await createTeacher({
        name: String(data.name || '').trim(), subject: String(data.subject || '').trim(),
        qualifications: Array.isArray(data.qualifications) ? data.qualifications.map(String).filter(Boolean) : [],
        bio: String(data.bio || '').trim(), photo: String(data.photo || '').trim(),
      });
      return NextResponse.json(teacher, { status: 201 });
    } else if (body.type === 'testimonial') {
      const testimonial = await createTestimonial({
        parentName: String(data.parentName || '').trim(), parentNameBn: String(data.parentNameBn || '').trim(),
        parentRole: String(data.parentRole || '').trim(), parentRoleBn: String(data.parentRoleBn || '').trim(),
        quote: String(data.quote || '').trim(), quoteBn: String(data.quoteBn || '').trim(),
      });
      return NextResponse.json(testimonial, { status: 201 });
    } else if (body.type === 'faq') {
      const displayOrder = Number(data.displayOrder);
      if (!Number.isInteger(displayOrder)) return NextResponse.json({ error: 'FAQ order must be a whole number.' }, { status: 400 });
      const faq = await createFaq({ question: String(data.question || '').trim(), answer: String(data.answer || '').trim(), displayOrder });
      return NextResponse.json(faq, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Unsupported content type.' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: `Unable to create content: ${error instanceof Error ? error.message : String(error)}` }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as { type?: string; id?: string; data?: Record<string, unknown> };
    if (!body.type || !body.data || (body.type !== 'site' && !body.id)) {
      return NextResponse.json({ error: 'Content type and data are required.' }, { status: 400 });
    }
    const data = body.data;
    if (body.type === 'teacher') {
      await updateTeacher(String(body.id), {
        name: String(data.name || '').trim(), subject: String(data.subject || '').trim(),
        qualifications: Array.isArray(data.qualifications) ? data.qualifications.map(String).filter(Boolean) : [],
        bio: String(data.bio || '').trim(), photo: String(data.photo || '').trim(),
      });
    } else if (body.type === 'testimonial') {
      await updateTestimonial(String(body.id), {
        parentName: String(data.parentName || '').trim(), parentNameBn: String(data.parentNameBn || '').trim(),
        parentRole: String(data.parentRole || '').trim(), parentRoleBn: String(data.parentRoleBn || '').trim(),
        quote: String(data.quote || '').trim(), quoteBn: String(data.quoteBn || '').trim(),
      });
    } else if (body.type === 'faq') {
      const displayOrder = Number(data.displayOrder);
      if (!Number.isInteger(displayOrder)) return NextResponse.json({ error: 'FAQ order must be a whole number.' }, { status: 400 });
      await updateFaq(String(body.id), { question: String(data.question || '').trim(), answer: String(data.answer || '').trim(), displayOrder });
    } else if (body.type === 'site') {
      await updateSiteSettings(data);
    } else {
      return NextResponse.json({ error: 'Unsupported content type.' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    if (error instanceof Error && error.message === 'NOT_FOUND') return NextResponse.json({ error: 'Content record was not found.' }, { status: 404 });
    return NextResponse.json({ error: `Unable to save content: ${error instanceof Error ? error.message : String(error)}` }, { status: 503 });
  }
}
