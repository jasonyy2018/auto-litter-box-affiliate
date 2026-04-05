'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                router.push('/login?registered=true');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-[#E5E4E1]">
                <h1 className="text-3xl font-bold text-text-primary text-center mb-2">Create Account</h1>
                <p className="text-text-muted text-center mb-8">Sign up to manage your orders and more.</p>

                {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-xl text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 rounded-xl border border-[#E5E4E1] outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all bg-surface-bg"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl border border-[#E5E4E1] outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all bg-surface-bg"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl border border-[#E5E4E1] outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all bg-surface-bg"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-primary-600 hover:bg-[#2D6A44] text-white font-bold text-lg rounded-xl transition-all disabled:opacity-70 shadow-lg"
                    >
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-text-secondary text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-600 font-bold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
