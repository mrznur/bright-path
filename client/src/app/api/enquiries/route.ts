import { NextResponse } from 'next/server';
import { createEnquiry } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = String(body.phone || '').replace(/[\s-]/g, '');
    const required = ['name', 'classLevel', 'subject', 'course'];
    if (required.some((field) => !String(body[field] || '').trim()) || !/^(?:\+?880|0)1[3-9]\d{8}$/.test(phone) || body.consent !== true) {
      return NextResponse.json({ error: 'Please provide valid enquiry details and consent.' }, { status: 400 });
    }
    const enquiry = await createEnquiry({
      name: String(body.name).trim(),
      phone,
      classLevel: String(body.classLevel).trim(),
      subject: String(body.subject).trim(),
      course: String(body.course).trim(),
      question: String(body.question || '').trim(),
    });
    return NextResponse.json({ id: enquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to save your enquiry right now.' }, { status: 503 });
  }
}
