import React from 'react';
import Link from 'next/link';
import { Cat } from 'lucide-react';

const Footer = () => {
    const footerLinks = {
        'Best Picks': [
            { label: 'Best Overall 2026', href: '/best' },
            { label: 'Best Value Pick', href: '/best' },
            { label: 'Premium Choice', href: '/best' },
            { label: 'Budget Friendly', href: '/best' },
        ],
        'Comparisons': [
            { label: 'Litter-Robot vs PETKIT', href: '/compare/litter-robot-vs-petkit' },
            { label: 'PETKIT vs CatLink', href: '/compare/petkit-vs-catlink' },
            { label: 'Full Feature Table', href: '/compare' },
        ],
        'Resources': [
            { label: 'Buying Guide', href: '/guides/how-to-choose' },
            { label: 'Is It Worth It?', href: '/blog/is-automatic-litter-box-worth-it' },
            { label: 'Privacy Policy', href: '/privacy' },
        ],
    };

    return (
        <footer className="bg-text-primary text-text-muted pt-20 pb-[60px] font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[60px] mb-[60px]">
                    {/* Brand */}
                    <div className="col-span-1">
                        <Link href="/" className="flex items-center gap-[10px] mb-8 group">
                            <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center transition-transform group-hover:scale-105">
                                <Cat className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-[22px] text-white tracking-tight">
                                Auto<span className="text-primary-600">Litter</span>
                            </span>
                        </Link>
                        <p className="text-[14px] leading-relaxed text-text-muted max-w-[280px]">
                            Empowering cat owners with expert testing and honest reviews to find the perfect self-cleaning litter box.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="col-span-1">
                            <h3 className="font-bold text-white mb-8 text-[11px] uppercase tracking-[2px]">
                                {category}
                            </h3>
                            <ul className="space-y-[16px]">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[14px] font-medium hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-[#333333] w-full mb-10" />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <p className="text-[12px] font-medium">
                            &copy; {new Date().getFullYear()} AutoLitter. Hands-on testing, honest results.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.pinterest.com/autolitterboxpro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-[#E60023] transition-colors"
                                aria-label="Follow us on Pinterest"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-8 text-[12px] font-medium">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
