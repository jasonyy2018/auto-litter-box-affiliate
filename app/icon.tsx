import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: '#3D8A5A',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '20%', // Rounded square
                }}
            >
                {/* SVG representation of the Lucide 'Cat' icon for Edge compatibility */}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 5c2.97 0 5.43 2.11 5.91 5H5.09A6 6 0 0 1 12 5Z" />
                    <path d="M12 5V3" />
                    <path d="M3 7v2c0 8.28 5.52 15 12 15s12-6.72 12-15V7" />
                    <circle cx="9" cy="13" r="1.5" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="13" r="1.5" fill="currentColor" stroke="none" />
                    <path d="M12 18v-2" />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            // For convenience, we can re-use the exported dimensions
            ...size,
        }
    );
}
