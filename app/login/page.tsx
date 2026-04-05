'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError('Invalid email or password.');
            } else {
                router.push('/');
                router.refresh(); // reload session
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-[#E5E4E1]">
            <h1 className="text-3xl font-bold text-text-primary text-center mb-2">Welcome Back</h1>
            <p className="text-text-muted text-center mb-8">Log in to your account</p>

            {registered && (
                <div className="p-3 mb-6 bg-green-50 text-green-700 rounded-xl text-center text-sm font-medium">
                    Account created! You can now log in.
                </div>
            )}
            {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-xl text-center text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    <label className="block text-sm font-bold text-text-primary mb-2 flex justify-between">
                        Password
                        <a href="#" className="font-normal text-text-muted hover:text-primary-600 text-xs">Forgot?</a>
                    </label>
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
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <p className="mt-8 text-center text-text-secondary text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary-600 font-bold hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
