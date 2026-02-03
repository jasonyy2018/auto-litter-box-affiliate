'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TOCProps {
  selector?: string;
}

export default function TOC({ selector = 'h2, h3' }: TOCProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Get all headings from the content
    const elements = document.querySelectorAll(selector);
    const items: TOCItem[] = [];

    elements.forEach((element) => {
      const id = element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      if (!element.id) {
        element.id = id;
      }
      items.push({
        id,
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1)),
      });
    });

    setHeadings(items);
  }, [selector]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="bg-gray-50 rounded-xl p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Table of Contents</h3>
      </div>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`
                block py-1.5 text-sm transition-colors border-l-2
                ${
                  activeId === heading.id
                    ? 'text-primary-600 border-primary-600 font-medium pl-4'
                    : 'text-gray-600 border-transparent hover:text-primary-600 hover:border-primary-300 pl-4'
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
