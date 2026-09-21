export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticketx.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/checkout', '/confirmation/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
