import { NextResponse } from 'next/server';
import { getPublicContent } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getPublicContent(), {
      headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to load site content.' }, { status: 503 });
  }
}
