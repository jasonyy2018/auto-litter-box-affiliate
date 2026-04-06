'use client';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    return (
        <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-colors mt-2"
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </button>
    );
}
