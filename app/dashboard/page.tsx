import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Package, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Fetch user orders if the database is configured
    // Wait, the user might not have pushed the schema so this could fail on their end locally if they haven't run `prisma db push`.
    // Let's add a safe catch block just in case to show empty state instead of a nasty 500 error.
    let orders: any[] = [];
    let dbError = false;

    try {
        if (session && session.user && session.user.id) {
            orders = await prisma.order.findMany({
                where: { userId: session.user.id },
                include: { items: true },
                orderBy: { createdAt: 'desc' }
            });
        }
    } catch (e) {
        dbError = true;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E4E1] p-8">
            <h1 className="text-2xl font-bold text-text-primary mb-6">Recent Orders</h1>
            
            {dbError ? (
                <div className="py-12 text-center text-text-muted">
                    <p>Unable to connect to order database. Please ensure your environment is configured.</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-surface-bg rounded-full flex items-center justify-center mb-4 text-[#D1D0CD]">
                        <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">No orders yet</h3>
                    <p className="text-text-secondary mb-6 max-w-sm mx-auto">When you make a purchase from our shop, your orders and tracking information will appear here.</p>
                    <Link href="/shop" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-[#2D6A44] transition-colors">
                        Browse Shop
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="border border-[#E5E4E1] rounded-xl overflow-hidden">
                            <div className="bg-surface-bg p-4 flex flex-wrap gap-4 justify-between border-b border-[#E5E4E1] text-sm">
                                <div>
                                    <span className="block text-text-muted font-medium mb-1">Order Placed</span>
                                    <span className="font-bold text-text-primary">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-text-muted font-medium mb-1">Total</span>
                                    <span className="font-bold text-text-primary">${order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="block text-text-muted font-medium mb-1">Status</span>
                                    <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-right grow">
                                    <span className="block text-text-muted font-medium mb-1">Order #</span>
                                    <span className="font-mono text-text-primary">{order.id}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        {item.image && (
                                            <div className="w-16 h-16 bg-surface-bg rounded-lg shrink-0 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-bold text-text-primary">{item.name}</p>
                                            <p className="text-sm text-text-muted">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
