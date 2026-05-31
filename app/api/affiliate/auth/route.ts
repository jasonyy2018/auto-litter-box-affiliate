import { NextRequest, NextResponse } from 'next/server';
import { registerAffiliate, loginAffiliate } from '@/lib/affiliateSystem';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, username, fullName, email, password, usernameOrEmail } = body;

        if (action === 'register') {
            if (!username || !fullName || !email || !password) {
                return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
            }

            const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
            if (cleanUser.length < 3) {
                return NextResponse.json({ error: 'Username must be at least 3 alphanumeric characters' }, { status: 400 });
            }

            const user = registerAffiliate(cleanUser, fullName, email, password);
            if (!user) {
                return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
            }

            // Set cookie for session
            const response = NextResponse.json({ success: true, user: { username: user.username, fullName: user.fullName, email: user.email } });
            response.cookies.set('affiliate_session', user.username, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                httpOnly: false, // Accessible by frontend for display
                sameSite: 'lax',
            });
            return response;
        }

        if (action === 'login') {
            if (!usernameOrEmail || !password) {
                return NextResponse.json({ error: 'Username/Email and Password are required' }, { status: 400 });
            }

            const user = loginAffiliate(usernameOrEmail, password);
            if (!user) {
                return NextResponse.json({ error: 'Invalid username/email or password' }, { status: 400 });
            }

            // Set cookie for session
            const response = NextResponse.json({ success: true, user: { username: user.username, fullName: user.fullName, email: user.email } });
            response.cookies.set('affiliate_session', user.username, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                httpOnly: false,
                sameSite: 'lax',
            });
            return response;
        }

        if (action === 'logout') {
            const response = NextResponse.json({ success: true });
            response.cookies.delete('affiliate_session');
            return response;
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Affiliate Auth error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Auth failed' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const session = request.cookies.get('affiliate_session')?.value;
    if (!session) {
        return NextResponse.json({ authenticated: false });
    }

    const { getAffiliates } = require('@/lib/affiliateSystem');
    const user = getAffiliates().find((u: any) => u.username === session);
    if (!user) {
        return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
        authenticated: true,
        user: {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt
        }
    });
}
