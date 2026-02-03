'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="my-8">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {title && <h2 className="text-3xl font-bold text-[#1A1918] mb-8 text-center">{title}</h2>}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white border border-[#E5E4E1] rounded-[24px] overflow-hidden group transition-all hover:border-[#3D8A5A]">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-10 py-8 text-left flex justify-between items-center group/btn"
              aria-expanded={openIndex === index}
            >
              <span className="text-lg font-bold text-[#1A1918] group-hover/btn:text-[#3D8A5A] transition-colors pr-4">{item.question}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'bg-[#3D8A5A] text-white rotate-45' : 'bg-[#F5F4F1] text-[#3D8A5A]'}`}>
                <Plus className="w-6 h-6" />
              </div>
            </button>
            {openIndex === index && (
              <div className="px-10 pb-8 animate-fade-in">
                <div className="pt-2 border-t border-[#F5F4F1]">
                   <p className="text-[#6D6C6A] leading-relaxed font-medium mt-6">{item.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
