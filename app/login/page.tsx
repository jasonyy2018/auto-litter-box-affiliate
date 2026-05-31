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
                    <label className="flex text-sm font-bold text-text-primary mb-2 justify-between">
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

            <div className="relative my-6 flex items-center justify-center">
                <div className="absolute w-full border-t border-[#E5E4E1]"></div>
                <span className="relative bg-white px-4 text-xs font-semibold text-text-muted uppercase">or</span>
            </div>

            <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full py-3.5 bg-white hover:bg-surface-bg text-text-secondary font-bold text-sm border border-[#E5E4E1] rounded-xl transition-all shadow-sm flex items-center justify-center gap-3"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                </svg>
                Continue with Google
            </button>

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
