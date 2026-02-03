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
                    <p className="text-[12px] font-medium">
                        &copy; {new Date().getFullYear()} AutoLitter. Hands-on testing, honest results.
                    </p>
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
