import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const title = searchParams.get('title') || 'Best Automatic Litter Boxes 2026';
        const subtitle = searchParams.get('subtitle') || 'Tested by Cat Care Experts';
        const price = searchParams.get('price');
        const badge = searchParams.get('badge') || 'Expert Pick';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        backgroundColor: '#F5F4F1',
                        padding: '60px 80px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Top Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: '#3D8A5A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                paddingLeft: '14px',
                                paddingTop: '8px',
                            }}
                        >
                            🐾
                        </div>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1A1918' }}>
                            Auto<span style={{ color: '#3D8A5A' }}>Litter</span>
                        </span>
                        <div
                            style={{
                                backgroundColor: '#C8F0D8',
                                color: '#3D8A5A',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                padding: '6px 16px',
                                borderRadius: '999px',
                                textTransform: 'uppercase',
                                marginLeft: '24px',
                            }}
                        >
                            {badge}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
                        <h1
                            style={{
                                fontSize: '56px',
                                fontWeight: 'bold',
                                color: '#1A1918',
                                lineHeight: '1.15',
                                margin: 0,
                            }}
                        >
                            {title}
                        </h1>
                        <p style={{ fontSize: '24px', color: '#6D6C6A', margin: 0, fontWeight: 500 }}>
                            {subtitle}
                        </p>
                    </div>

                    {/* Footer / Price Tag */}
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '2px solid #E5E4E1',
                            paddingTop: '32px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#3D8A5A', fontSize: '20px', fontWeight: 'bold' }}>
                            ★ 4.8 Rating • 6+ Months Real Home Testing
                        </div>
                        {price && (
                            <div
                                style={{
                                    fontSize: '36px',
                                    fontWeight: 'bold',
                                    color: '#3D8A5A',
                                    backgroundColor: 'white',
                                    padding: '12px 28px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                }}
                            >
                                ${price}
                            </div>
                        )}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
    }
}
