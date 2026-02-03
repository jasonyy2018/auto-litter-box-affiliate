import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl lg:text-5xl font-bold text-[#1A1918] mb-8 leading-tight tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-[#1A1918] mb-6 mt-16 scroll-mt-24">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-[#1A1918] mb-4 mt-12 scroll-mt-24">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-[#6D6C6A] leading-relaxed mb-6 font-medium text-lg">{children}</p>
    ),
    a: ({ href, children }) => (
      <Link href={href || '#'} className="text-[#3D8A5A] font-bold hover:underline">
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <ul className="list-none mb-8 space-y-4">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="flex items-start gap-3 text-[#6D6C6A] font-medium text-lg italic">
         <div className="w-2 h-2 bg-[#3D8A5A] rounded-full mt-2.5 flex-shrink-0" />
         {children}
      </li>
    ),
    hr: () => <hr className="my-16 border-[#E5E4E1]" />,
    strong: ({ children }) => (
      <strong className="font-bold text-[#1A1918]">{children}</strong>
    ),
    ...components,
  };
}
