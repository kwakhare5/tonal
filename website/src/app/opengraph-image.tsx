export const runtime = 'edge';
export const alt = 'tonal — Inline Tone Adjustment Chrome Extension';
export const contentType = 'image/png';

export default async function Image() {
  try {
    const targetUrl = 'https://tonall.vercel.app';
    const screenshotApi = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&embed=screenshot.url&viewport.width=1200&viewport.height=630`;
    
    const res = await fetch(screenshotApi);
    if (!res.ok) throw new Error('Failed to fetch real website screenshot');
    
    const imageBuffer = await res.arrayBuffer();
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('OG Image fetch failed, falling back to basic branding card:', error);
    return new Response(
      `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0F0F0F"/>
        <text x="600" y="300" font-family="sans-serif" font-size="64" font-weight="bold" fill="#FFFFFF" text-anchor="middle">tonal</text>
        <text x="600" y="360" font-family="sans-serif" font-size="28" fill="#AEAEB2" text-anchor="middle">Two-way tone translator for Gmail, Slack &amp; LinkedIn</text>
      </svg>`,
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  }
}
