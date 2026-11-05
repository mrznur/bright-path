import { NextResponse } from 'next/server';
import { seedSupabase } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-api';

export async function POST() {
  try {
    await requireAdmin();
    const seeded = await seedSupabase();
    return NextResponse.json({ seeded });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ error: 'Unable to seed Supabase. Run supabase/schema.sql first and configure the service-role key.' }, { status: 503 });
  }
}
