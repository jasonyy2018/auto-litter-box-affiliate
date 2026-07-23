'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, Search, Filter, Bot, Shield, RefreshCw } from 'lucide-react';

interface AuditLog {
    id: string;
    source: string;
    action: string;
    actor: string | null;
    details: any;
    status: string;
    ip: string | null;
    duration: number | null;
    createdAt: string;
}

export default function AuditLogPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sourceFilter, setSourceFilter] = useState('');
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    const getToken = () => sessionStorage.getItem('admin-auth') || '';

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: '50',
            });
            if (sourceFilter) params.set('source', sourceFilter);

            const res = await fetch(`/api/admin/audit-logs?${params}`, {
                headers: { 'Authorization': `Bearer ${getToken()}` },
            });
            const data = await res.json();
            if (data.success) {
                setLogs(data.data.logs);
                setTotalPages(data.data.totalPages);
            } else {
                setError(data.error || 'Failed to load logs');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, [page, sourceFilter]);

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'openclaw': return <Bot className="w-5 h-5 text-purple-600" />;
            case 'admin': return <Shield className="w-5 h-5 text-blue-600" />;
            case 'webhook': return <RefreshCw className="w-5 h-5 text-green-600" />;
            default: return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success': return <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-[11px] font-bold"><CheckCircle2 className="w-3 h-3" />Success</span>;
            case 'error': return <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[11px] font-bold"><AlertCircle className="w-3 h-3" />Error</span>;
            case 'pending': return <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full text-[11px] font-bold"><Clock className="w-3 h-3" />Pending</span>;
            default: return <span className="text-xs text-text-muted">{status}</span>;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Audit Logs</h1>
                    <p className="text-text-muted mt-1">
                        Track every action performed by admins, OpenClaw Agent, and webhooks.
                    </p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E4E1] rounded-xl hover:bg-surface-bg transition-colors text-sm font-bold"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6 bg-white rounded-2xl p-4 border border-[#E5E4E1]">
                <Filter className="w-5 h-5 text-text-muted" />
                {['', 'admin', 'openclaw', 'webhook', 'system'].map(s => (
                    <button
                        key={s}
                        onClick={() => { setSourceFilter(s); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${sourceFilter === s
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-surface-bg text-text-secondary hover:bg-gray-200'
                            }`}
                    >
                        {s || 'All Sources'}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm mb-6">
                    {error}
                </div>
            )}

            {/* Logs Table */}
            <div className="bg-white rounded-2xl border border-[#E5E4E1] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-bg border-b border-[#E5E4E1]">
                            <tr>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Time</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Source</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Action</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Actor</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E4E1]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-text-muted">
                                        <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-3" />
                                        Loading logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-text-muted">
                                        <Clock className="w-12 h-12 mx-auto mb-3 text-[#D1D0CD]" />
                                        <p className="font-bold">No audit logs yet</p>
                                        <p className="text-sm mt-1">Logs appear when admins or OpenClaw perform actions.</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr
                                        key={log.id}
                                        onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                                        className={`hover:bg-surface-bg/50 cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-primary-50' : ''}`}
                                    >
                                        <td className="px-6 py-4 text-sm text-text-muted font-mono">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getSourceIcon(log.source)}
                                                <span className="text-sm font-bold capitalize">{log.source}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm bg-surface-bg px-2 py-1 rounded font-mono">
                                                {log.action}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">
                                            {log.actor || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(log.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-text-muted font-mono">
                                            {log.duration ? `${log.duration}ms` : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Log Detail Panel */}
                {selectedLog && (
                    <div className="border-t border-[#E5E4E1] bg-[#0A0A0A] p-6">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Log Details — {selectedLog.action}
                        </h3>
                        <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap overflow-auto max-h-64">
                            {JSON.stringify(selectedLog.details || {}, null, 2)}
                        </pre>
                        {selectedLog.ip && (
                            <p className="text-gray-500 text-xs mt-4 font-mono">
                                IP: {selectedLog.ip}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="w-10 h-10 rounded-xl border border-[#E5E4E1] flex items-center justify-center hover:bg-white disabled:opacity-30 transition-all"
                    >
                        ←
                    </button>
                    <span className="text-sm font-bold text-text-muted">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="w-10 h-10 rounded-xl border border-[#E5E4E1] flex items-center justify-center hover:bg-white disabled:opacity-30 transition-all"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}
