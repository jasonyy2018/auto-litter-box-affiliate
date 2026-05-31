'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TrackerContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            const cleanRef = ref.trim().toLowerCase();
            // Store referral in localStorage
            localStorage.setItem('referred_by', cleanRef);
            
            // Track click on backend (fire and forget, ignore errors)
            fetch('/api/affiliate/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: cleanRef })
            }).catch(err => console.error('Failed to report affiliate click', err));
        }
    }, [searchParams]);

    return null;
}

export default function AffiliateTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerContent />
        </Suspense>
    );
}
