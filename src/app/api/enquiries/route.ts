import { NextResponse } from 'next/server';
import { createEnquiry } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await createEnquiry({
            name: body.name,
            phone: body.phone,
            classLevel: body.classLevel,
            subject: body.subject,
            course: body.course,
            question: body.question || '',
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
    }
}