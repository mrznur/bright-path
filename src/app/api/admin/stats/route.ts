import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { getDashboardStats } from '@/lib/db';

export async function GET() {
    try {
        await requireAdmin();
        const stats = await getDashboardStats();
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}