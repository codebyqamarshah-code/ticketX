import { events } from '@/data/events';
import { artists } from '@/data/artists';
import { teams } from '@/data/teams';
import { venues } from '@/data/venues';
import { popularCities } from '@/data/categories';
import { allGuides } from '@/data/guides';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticketx.com';

  const staticRoutes = [
    '',
    '/concerts',
    '/sports',
    '/arts-theater',
    '/comedy',
    '/family',
    '/cities',
    '/guides',
    '/search',
    '/cart',
    '/checkout',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const guideRoutes = allGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/event/${event.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const ticketRoutes = events.map((event) => ({
    url: `${baseUrl}/event/${event.slug}/tickets`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'hourly',
    priority: 0.95,
  }));

  const artistRoutes = artists.map((artist) => ({
    url: `${baseUrl}/artist/${artist.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const teamRoutes = teams.map((team) => ({
    url: `${baseUrl}/team/${team.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const venueRoutes = venues.map((venue) => ({
    url: `${baseUrl}/venue/${venue.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const cityRoutes = popularCities.map((city) => ({
    url: `${baseUrl}/cities/${city.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...guideRoutes,
    ...eventRoutes,
    ...ticketRoutes,
    ...artistRoutes,
    ...teamRoutes,
    ...venueRoutes,
    ...cityRoutes,
  ];
}
