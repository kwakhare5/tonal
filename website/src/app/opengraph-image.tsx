export const runtime = 'edge';
export const alt = 'Tonal — Inline Tone Adjustment';
export const contentType = 'image/png';

export default async function Image() {
  try {
    const targetUrl = 'https://tonall.vercel.app';
    const screenshotApi = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&embed=screenshot.url&viewport.width=1200&viewport.height=630`;
    
    const res = await fetch(screenshotApi);
    if (!res.ok) throw new Error('Failed to fetch screenshot');
    
    const imageBuffer = await res.arrayBuffer();
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('OG Image fetch failed, falling back to basic card:', error);
    // Return a simple SVG fallback if API fails
    return new Response(
      `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#FFFFFF"/>
        <text x="600" y="315" font-family="sans-serif" font-size="48" font-weight="bold" fill="#0F0F0F" text-anchor="middle">Tonal</text>
        <text x="600" y="370" font-family="sans-serif" font-size="24" fill="#666666" text-anchor="middle">Inline Tone Adjustment Chrome Extension</text>
      </svg>`,
      {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      }
    );
  }
}
