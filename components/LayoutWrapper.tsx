'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // If we're on any admin route, hide the public UI entirely
    if (pathname?.startsWith('/admin')) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="grow">{children}</main>
            <Footer />
            <CartDrawer />
        </div>
    );
}
