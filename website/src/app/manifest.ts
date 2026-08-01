import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'tonal — Inline Tone Adjustment',
    short_name: 'tonal',
    description: 'AI-powered tone translation Chrome extension for Gmail, Slack, and LinkedIn.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#0B192C',
    icons: [
      {
        src: '/icons/icon128.png',
        sizes: '128x128',
        type: 'image/png',
      },
    ],
  };
}
