export const runtime = 'edge';
export const alt = 'tonal — Inline Tone Adjustment Chrome Extension';
export const contentType = 'image/png';
export const revalidate = 86400; // 24 hours auto-refresh

export default async function Image() {
  try {
    const targetUrl = 'https://tonall.vercel.app';
    // Exact 1200x630 standard OpenGraph desktop framing (0 zoom, 0 crop, 1.0 scale)
    const screenshotApi = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&embed=screenshot.url&viewport.width=1200&viewport.height=630&viewport.deviceScaleFactor=1&waitForTimeout=1500`;

    const res = await fetch(screenshotApi, {
      next: { revalidate: 86400 },
    });
    
    if (!res.ok) throw new Error('Failed to fetch real website screenshot');

    const imageBuffer = await res.arrayBuffer();
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('OG Image fetch failed, falling back to basic branding card:', error);
    return new Response(
      `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0B192C"/>
        <text x="600" y="300" font-family="sans-serif" font-size="64" font-weight="bold" fill="#FFFFFF" text-anchor="middle">tonal</text>
        <text x="600" y="360" font-family="sans-serif" font-size="28" fill="#94A3B8" text-anchor="middle">Inline Tone Adjustment Chrome Extension</text>
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
