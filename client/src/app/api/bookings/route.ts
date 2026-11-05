import { NextResponse } from 'next/server';
import { createBooking } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = String(body.phone || '').replace(/[\s-]/g, '');
    const required = ['courseId', 'batchId', 'parentName', 'studentName', 'classLevel', 'paymentMethod'];
    if (required.some((field) => !String(body[field] || '').trim()) || !/^(?:\+?880|0)1[3-9]\d{8}$/.test(phone) || body.consent !== true) {
      return NextResponse.json({ error: 'Please provide valid booking details and consent.' }, { status: 400 });
    }
    if (!['bKash', 'Nagad', 'Bank transfer'].includes(String(body.paymentMethod))) {
      return NextResponse.json({ error: 'Please choose a valid payment method.' }, { status: 400 });
    }
    const booking = await createBooking({
      courseId: String(body.courseId), batchId: String(body.batchId), parentName: String(body.parentName).trim(),
      studentName: String(body.studentName).trim(), phone, classLevel: String(body.classLevel).trim(),
      paymentMethod: String(body.paymentMethod), note: String(body.note || '').trim(),
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'BATCH_UNAVAILABLE') {
      return NextResponse.json({ error: 'This batch is full or no longer available.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Unable to save your booking right now.' }, { status: 503 });
  }
}
