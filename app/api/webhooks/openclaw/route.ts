import { NextRequest, NextResponse } from 'next/server';
import { logAudit } from '@/lib/auditLog';

/**
 * Webhook endpoint for OpenClaw async task callbacks.
 * OpenClaw can POST here when a long-running task completes.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { taskId, status, result, error } = body;

        // Optional: verify webhook secret
        const webhookSecret = process.env.OPENCLAW_WEBHOOK_SECRET;
        const signature = request.headers.get('x-webhook-signature');
        if (webhookSecret && signature !== webhookSecret) {
            return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
        }

        if (!taskId) {
            return NextResponse.json(
                { success: false, error: 'taskId is required' },
                { status: 400 }
            );
        }

        // Log the webhook event
        await logAudit({
            source: 'webhook',
            action: `openclaw.task.${status || 'completed'}`,
            actor: 'OpenClaw',
            details: { taskId, result, error },
            status: error ? 'error' : status === 'failed' ? 'error' : 'success',
        });

        return NextResponse.json({
            success: true,
            message: `Webhook received for task ${taskId}`,
        });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET handler to verify webhook endpoint is alive.
 */
export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'OpenClaw webhook endpoint is active',
        timestamp: new Date().toISOString(),
    });
}
