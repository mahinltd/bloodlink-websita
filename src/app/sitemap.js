const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bloodlink.tech';

export default function sitemap() {
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/hospitals', priority: 0.9, changeFrequency: 'daily' },
    { path: '/blood-banks', priority: 0.9, changeFrequency: 'daily' },
    { path: '/download', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}