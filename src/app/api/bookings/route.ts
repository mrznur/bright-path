import { NextResponse } from 'next/server';
import { createBooking } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await createBooking({
            courseId: body.courseId,
            batchId: body.batchId,
            parentName: body.parentName,
            studentName: body.studentName,
            phone: body.phone,
            classLevel: body.classLevel,
            paymentMethod: body.paymentMethod,
            note: body.note || '',
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to book seat' }, { status: 400 });
    }
}