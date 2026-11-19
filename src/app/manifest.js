export default function manifest() {
  return {
    name: 'BloodLink — Voluntary Blood Donation Bangladesh',
    short_name: 'BloodLink',
    description:
      'Find blood donors near you, send SOS requests, save lives. 100% voluntary and non-profit.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#C62828',
    icons: [
      { src: '/images/favicon.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}