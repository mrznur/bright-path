import { NextResponse } from 'next/server';
import { getPublicContent } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const content = await getPublicContent();
        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
    }
}