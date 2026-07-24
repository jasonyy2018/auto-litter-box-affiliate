import { prisma } from './prisma';

export interface AuditLogEntry {
  source: 'admin' | 'openclaw' | 'webhook' | 'system';
  action: string;
  actor?: string;
  details?: Record<string, unknown>;
  status?: 'success' | 'error' | 'pending';
  ip?: string;
  duration?: number;
}

/**
 * Log an action to the audit log using raw SQL to avoid Prisma client sync issues.
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AuditLog" ("id", "source", "action", "actor", "details", "status", "ip", "duration", "createdAt")
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, NOW())`,
      `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      entry.source,
      entry.action,
      entry.actor || null,
      JSON.stringify(entry.details || {}),
      entry.status || 'success',
      entry.ip || null,
      entry.duration || null,
    );
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

/**
 * Fetch audit logs with pagination using raw SQL.
 */
export async function getAuditLogs(page = 1, pageSize = 50, source?: string) {
  try {
    const where = source ? `WHERE "source" = $1` : '';
    const params = source ? [source] : [];

    const logs = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "AuditLog" ${where} ORDER BY "createdAt" DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
      ...params,
    );

    const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM "AuditLog" ${where}`,
      ...params,
    );

    const total = Number(countResult[0]?.count || 0);

    return {
      logs: logs.map((log: any) => ({
        ...log,
        createdAt: log.createdAt?.toISOString ? log.createdAt.toISOString() : log.createdAt,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return { logs: [], total: 0, page, pageSize, totalPages: 0 };
  }
}