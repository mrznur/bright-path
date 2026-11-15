import { NextResponse } from 'next/server';
import { createAdminSession, getAdminCredentials, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from '@/lib/admin-auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        let credentials: { email: string; password: string };
        try {
            credentials = getAdminCredentials();
        } catch {
            console.error('Admin credentials not configured — check ADMIN_EMAIL and ADMIN_PASSWORD in .env.local');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        if (email !== credentials.email || password !== credentials.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await createAdminSession(email);

        const response = NextResponse.json({ success: true });
        response.cookies.set(ADMIN_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: ADMIN_SESSION_MAX_AGE,
            path: '/',
        });
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}