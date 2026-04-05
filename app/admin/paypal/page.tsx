'use client';

import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, XCircle, Loader2, RefreshCw, Shield, ExternalLink,
    AlertTriangle, Trash2, Eye, EyeOff
} from 'lucide-react';

interface PayPalConfig {
    clientId: string;
    clientSecret: string;
    mode: string;
    isActive: boolean;
    lastVerified: string | null;
    merchantId: string | null;
}

interface VerifyResult {
    success: boolean;
    message?: string;
    error?: string;
    merchantId?: string;
    email?: string;
    mode?: string;
}

export default function AdminPayPalPage() {
    const [config, setConfig] = useState<PayPalConfig | null>(null);
    const [configured, setConfigured] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [mode, setMode] = useState<'sandbox' | 'live'>('sandbox');
    const [showSecret, setShowSecret] = useState(false);

    // Action state
    const [saving, setSaving] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);

    const getToken = () => sessionStorage.getItem('admin-auth') || '';

    // Fetch current config
    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/paypal', {
                headers: { 'Authorization': `Bearer ${getToken()}` },
            });
            const data = await res.json();
            if (data.success) {
                setConfigured(data.configured);
                if (data.data) {
                    setConfig(data.data);
                    setClientId(data.data.clientId);
                    setMode(data.data.mode);
                }
            }
        } catch (error) {
            console.error('Failed to fetch PayPal config:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSaveMessage(null);
        setVerifyResult(null);

        try {
            const res = await fetch('/api/admin/paypal', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientId, clientSecret, mode }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setSaveMessage({ type: 'success', text: data.message || 'Credentials saved!' });
                setConfigured(true);
                setConfig(data.data);
                setClientSecret(''); // Clear secret from form
            } else {
                setSaveMessage({ type: 'error', text: data.error || 'Failed to save' });
            }
        } catch {
            setSaveMessage({ type: 'error', text: 'Connection error' });
        } finally {
            setSaving(false);
        }
    }

    async function handleVerify() {
        setVerifying(true);
        setVerifyResult(null);

        try {
            const res = await fetch('/api/admin/paypal/verify', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${getToken()}` },
            });
            const data = await res.json();
            setVerifyResult(data);

            if (data.success) {
                // Refresh config to get updated status
                await fetchConfig();
            }
        } catch {
            setVerifyResult({ success: false, error: 'Connection error' });
        } finally {
            setVerifying(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to remove PayPal configuration? This cannot be undone.')) {
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch('/api/admin/paypal', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` },
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setConfig(null);
                setConfigured(false);
                setClientId('');
                setClientSecret('');
                setMode('sandbox');
                setVerifyResult(null);
                setSaveMessage({ type: 'success', text: 'PayPal configuration removed' });
            }
        } catch {
            setSaveMessage({ type: 'error', text: 'Failed to delete configuration' });
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">PayPal Settings</h1>
                <p className="text-text-secondary font-medium">
                    Configure your PayPal account to accept payments on your shop.
                </p>
            </div>

            {/* Connection Status Card */}
            <div className={`rounded-2xl border p-6 mb-8 ${
                config?.isActive
                    ? 'bg-green-50 border-green-200'
                    : configured
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-[#E5E4E1]'
            }`}>
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        config?.isActive
                            ? 'bg-green-100 text-green-600'
                            : configured
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-gray-100 text-gray-400'
                    }`}>
                        {config?.isActive ? (
                            <CheckCircle2 className="w-7 h-7" />
                        ) : configured ? (
                            <AlertTriangle className="w-7 h-7" />
                        ) : (
                            <Shield className="w-7 h-7" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-text-primary">
                            {config?.isActive
                                ? 'PayPal Connected'
                                : configured
                                    ? 'PayPal Configured — Verification Needed'
                                    : 'PayPal Not Configured'
                            }
                        </h2>
                        <p className="text-sm text-text-secondary mt-0.5">
                            {config?.isActive
                                ? `Mode: ${config.mode === 'live' ? '🟢 Live' : '🟡 Sandbox'} · Merchant: ${config.merchantId || 'N/A'} · Verified: ${config.lastVerified ? new Date(config.lastVerified).toLocaleString() : 'N/A'}`
                                : configured
                                    ? 'Credentials saved but not yet verified. Click "Verify Connection" to test.'
                                    : 'Enter your PayPal API credentials below to enable payments.'
                            }
                        </p>
                    </div>
                    {configured && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleVerify}
                                disabled={verifying}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#0070BA] hover:bg-[#003087] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
                            >
                                {verifying ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                                Verify Connection
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 px-3 py-2.5 text-red-500 hover:bg-red-50 text-sm font-bold rounded-xl transition-colors"
                                title="Remove configuration"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Verify Result */}
            {verifyResult && (
                <div className={`rounded-2xl border p-5 mb-8 ${
                    verifyResult.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                }`}>
                    <div className="flex items-start gap-3">
                        {verifyResult.success ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div>
                            <p className={`font-bold text-sm ${verifyResult.success ? 'text-green-800' : 'text-red-800'}`}>
                                {verifyResult.success ? 'Connection Verified!' : 'Verification Failed'}
                            </p>
                            {verifyResult.success ? (
                                <div className="text-sm text-green-700 mt-1 space-y-0.5">
                                    {verifyResult.email && <p>Email: {verifyResult.email}</p>}
                                    {verifyResult.merchantId && <p>Merchant ID: {verifyResult.merchantId}</p>}
                                    {verifyResult.mode && <p>Mode: {verifyResult.mode}</p>}
                                </div>
                            ) : (
                                <p className="text-sm text-red-700 mt-1">{verifyResult.error}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Save Message */}
            {saveMessage && (
                <div className={`rounded-xl px-4 py-3 mb-6 text-sm font-medium ${
                    saveMessage.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {saveMessage.text}
                </div>
            )}

            {/* Credentials Form */}
            <div className="bg-white rounded-2xl border border-[#E5E4E1] p-6 mb-8">
                <h2 className="text-lg font-bold text-text-primary mb-1">API Credentials</h2>
                <p className="text-sm text-text-muted mb-6">
                    Enter your PayPal REST API credentials. Client Secret is stored encrypted.
                </p>

                <form onSubmit={handleSave} className="space-y-5">
                    {/* Mode Toggle */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">Environment</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setMode('sandbox')}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                                    mode === 'sandbox'
                                        ? 'border-[#0070BA] bg-blue-50 text-[#0070BA]'
                                        : 'border-[#E5E4E1] text-text-muted hover:border-gray-300'
                                }`}
                            >
                                🟡 Sandbox (Testing)
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('live')}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                                    mode === 'live'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-[#E5E4E1] text-text-muted hover:border-gray-300'
                                }`}
                            >
                                🟢 Live (Production)
                            </button>
                        </div>
                        {mode === 'live' && (
                            <p className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Live mode processes real payments. Make sure your credentials are correct.
                            </p>
                        )}
                    </div>

                    {/* Client ID */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">
                            Client ID
                        </label>
                        <input
                            type="text"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            placeholder={configured ? '(unchanged)' : 'e.g. AXk3b...'}
                            className="w-full px-4 py-3.5 bg-surface-bg rounded-xl text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0070BA]/30 transition-all"
                        />
                    </div>

                    {/* Client Secret */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">
                            Client Secret
                        </label>
                        <div className="relative">
                            <input
                                type={showSecret ? 'text' : 'password'}
                                value={clientSecret}
                                onChange={(e) => setClientSecret(e.target.value)}
                                placeholder={configured ? config?.clientSecret || '••••••••' : 'Enter secret...'}
                                className="w-full px-4 py-3.5 pr-12 bg-surface-bg rounded-xl text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0070BA]/30 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSecret(!showSecret)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                            >
                                {showSecret ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>
                        {configured && (
                            <p className="mt-1.5 text-xs text-text-muted">
                                Leave blank to keep the existing secret. Enter a new value to replace it.
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={saving || !clientId || (!clientSecret && !configured)}
                        className="w-full py-4 bg-[#0070BA] hover:bg-[#003087] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Shield className="w-4 h-4" />
                                {configured ? 'Update Credentials' : 'Save Credentials'}
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Setup Guide */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.44a.807.807 0 00-.797.68l-.064.346-.456 2.908-.028.18a.807.807 0 01-.797.68H8.44a.483.483 0 01-.477-.558l.006-.04.468-2.98.012-.06a.807.807 0 01.797-.68h.657c3.478 0 6.2-1.412 6.996-5.498.33-1.7.16-3.12-.71-4.12a3.46 3.46 0 00-.992-.805c.07-.02.14-.036.208-.05a4.882 4.882 0 012.084.15c.683.197 1.224.583 1.578 1.4z" />
                        <path d="M17.127 7.263a8.464 8.464 0 00-1.044-.243 13.832 13.832 0 00-2.2-.148h-6.6a.776.776 0 00-.77.658L5.15 15.478l-.03.18a.807.807 0 01.797-.68h1.664c3.477 0 6.2-1.413 6.995-5.498.024-.12.043-.237.06-.351.227-.12.486-.22.77-.293a5.3 5.3 0 01.678-.138l.046-.007c-.2-.97-.643-1.627-1.38-2.123a5.036 5.036 0 00-.623-.305z" />
                        <path d="M6.513 7.53a.776.776 0 01.77-.658h6.6c.782 0 1.512.05 2.2.148.195.03.386.063.573.101.27.057.53.126.78.207.2.065.39.137.57.214.367-2.348-.003-3.945-1.272-5.392C15.36.577 13.08 0 10.266 0H3.776a.807.807 0 00-.797.68L.01 18.49a.483.483 0 00.477.558h3.474l.872-5.534L6.513 7.53z" />
                    </svg>
                    Setup Guide
                </h3>
                <ol className="text-blue-700 text-sm space-y-3 list-decimal list-inside">
                    <li>
                        Go to{' '}
                        <a
                            href="https://developer.paypal.com/dashboard/applications"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline inline-flex items-center gap-1"
                        >
                            PayPal Developer Dashboard
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </li>
                    <li>Create a new app (or select existing one) under <strong>REST API apps</strong></li>
                    <li>Copy the <code className="bg-blue-100 px-1.5 py-0.5 rounded">Client ID</code> and <code className="bg-blue-100 px-1.5 py-0.5 rounded">Client Secret</code></li>
                    <li>Paste them above and select your environment (Sandbox for testing, Live for real payments)</li>
                    <li>Click <strong>&quot;Save Credentials&quot;</strong> then <strong>&quot;Verify Connection&quot;</strong></li>
                    <li>Once verified, PayPal checkout will be available in your shop!</li>
                </ol>

                <div className="mt-4 p-3 bg-blue-100 rounded-xl">
                    <p className="text-xs text-blue-800 font-medium">
                        💡 <strong>Tip:</strong> Start with Sandbox mode to test payments without real money.
                        PayPal provides test buyer accounts at{' '}
                        <a
                            href="https://developer.paypal.com/dashboard/accounts"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            developer.paypal.com/dashboard/accounts
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
