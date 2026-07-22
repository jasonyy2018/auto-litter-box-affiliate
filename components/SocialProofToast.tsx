'use client';

import { useEffect, useState } from 'react';

const proofMessages = [
  { name: 'Sarah in Houston', product: 'Litter-Robot 4', time: '3 minutes ago' },
  { name: 'Mike in Portland', product: 'PETKIT Pura Max', time: '7 minutes ago' },
  { name: 'Emily in Chicago', product: 'CatLink Scooper Pro', time: '12 minutes ago' },
  { name: 'David in Austin', product: 'Litter-Robot 3', time: '18 minutes ago' },
  { name: 'Jessica in Seattle', product: 'PETKIT Pura X', time: '22 minutes ago' },
];

export default function SocialProofToast({ enabled = true }: { enabled?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<typeof proofMessages[0] | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const showNotification = () => {
      const randomMessage = proofMessages[Math.floor(Math.random() * proofMessages.length)];
      setMessage(randomMessage);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    const initialTimeout = setTimeout(showNotification, 8000);
    const interval = setInterval(showNotification, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [enabled]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 bg-white rounded-2xl shadow-2xl border border-[#E5E4E1] p-4 animate-slide-up max-w-[280px] lg:bottom-8 lg:left-8">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-[#1A1918]">
            {message.name} just purchased
          </p>
          <p className="text-sm font-bold text-[#3D8A5A] mt-0.5">
            {message.product}
          </p>
          <p className="text-xs text-[#9C9B99] mt-1">
            {message.time}
          </p>
        </div>
      </div>
    </div>
  );
}
