import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, logAudit } from '@/lib/auditLog';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '50');
        const source = searchParams.get('source') || undefined;

        // Verify admin auth
        const auth = request.headers.get('authorization');
        const adminPass = process.env.ADMIN_PASSWORD;
        const token = auth?.replace('Bearer ', '');
        if (!token || token !== adminPass) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const result = await getAuditLogs(page, pageSize, source);
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch audit logs' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { source, action, actor, details, status, duration } = body;

        // Verify admin auth
        const auth = request.headers.get('authorization');
        const adminPass = process.env.ADMIN_PASSWORD;
        const token = auth?.replace('Bearer ', '');
        if (!token || token !== adminPass) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        if (!source || !action) {
            return NextResponse.json(
                { success: false, error: 'source and action are required' },
                { status: 400 }
            );
        }

        await logAudit({
            source,
            action,
            actor: actor || 'admin',
            details,
            status: status || 'success',
            duration,
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create audit log' },
            { status: 500 }
        );
    }
}
