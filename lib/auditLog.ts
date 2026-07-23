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
 * Log an action to the audit log.
 * Works both server-side and client-side (via API).
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        source: entry.source,
        action: entry.action,
        actor: entry.actor || null,
        details: (entry.details || {}) as any,
        status: entry.status || 'success',
        ip: entry.ip || null,
        duration: entry.duration || null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

/**
 * Fetch audit logs with pagination.
 */
export async function getAuditLogs(page = 1, pageSize = 50, source?: string) {
  const where = source ? { source } : {};

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
