import { artists } from './artists';
import { teams } from './teams';
import { venues } from './venues';
import { popularCities } from './categories';

export const events = [
  // --- CONCERTS ---
  {
    id: 'e001',
    slug: 'taylor-swift-eras-tour-la',
    title: 'Taylor Swift | The Eras Tour',
    category: 'concerts',
    subcategory: 'Pop',
    artist: 'Taylor Swift',
    artistSlug: 'taylor-swift',
    description: 'The record-breaking Eras Tour returns for a landmark final leg. Experience every era, every album, every memory in one unforgettable night at SoFi Stadium.',
    date: '2026-10-10',
    time: '7:00 PM',
    venue: 'SoFi Stadium',
    venueSlug: 'sofi-stadium',
    city: 'Los Angeles',
    country: 'USA',
    cityId: 'los-angeles',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    priceFrom: 89,
    priceTo: 750,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['pop', 'stadium', 'sold-out', 'eras'],
  },
  {
    id: 'e001-pk-1',
    slug: 'rahat-fateh-ali-khan-lahore-grand-concert',
    title: 'Rahat Fateh Ali Khan | Grand Sufi Concert',
    category: 'concerts',
    subcategory: 'Sufi & Qawwali',
    artist: 'Rahat Fateh Ali Khan',
    artistSlug: 'rahat-fateh-ali-khan',
    description: 'An unforgettable night of classical Qawwali and hit melodious melodies live at Alhamra Cultural Complex, Lahore.',
    date: '2026-10-25',
    time: '8:00 PM',
    venue: 'Alhamra Open Air Theater',
    venueSlug: 'alhamra-open-air',
    city: 'Lahore',
    country: 'Pakistan',
    cityId: 'lahore',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    priceFrom: 45,
    priceTo: 350,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: true,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['sufi', 'qawwali', 'lahore', 'live-concert'],
  },
  {
    id: 'e001-pk-2',
    slug: 'atif-aslam-live-in-karachi',
    title: 'Atif Aslam | Live in Concert Karachi',
    category: 'concerts',
    subcategory: 'Pop & Rock',
    artist: 'Atif Aslam',
    artistSlug: 'atif-aslam',
    description: 'Pakistan legend Atif Aslam performs his massive romantic hits and rock anthems live at Beach Park, Karachi.',
    date: '2026-11-02',
    time: '8:30 PM',
    venue: 'Beach Luxury Pavilion',
    venueSlug: 'beach-luxury',
    city: 'Karachi',
    country: 'Pakistan',
    cityId: 'karachi',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    priceFrom: 50,
    priceTo: 400,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: true,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['atif-aslam', 'karachi', 'pop', 'live'],
  },
  {
    id: 'e001-pk-3',
    slug: 'coke-studio-live-islamabad',
    title: 'Coke Studio Live | Islamabad Festival',
    category: 'concerts',
    subcategory: 'Fusion & Folk',
    artist: 'Coke Studio All-Stars',
    artistSlug: 'coke-studio',
    description: 'Experience iconic Coke Studio performances live on stage with full orchestra and traditional master musicians in Islamabad.',
    date: '2026-11-12',
    time: '7:30 PM',
    venue: 'Islamabad Club Arena',
    venueSlug: 'islamabad-club',
    city: 'Islamabad',
    country: 'Pakistan',
    cityId: 'islamabad',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    priceFrom: 60,
    priceTo: 450,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: true,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['coke-studio', 'islamabad', 'fusion', 'folk'],
  },
  {
    id: 'e001-pk-4',
    slug: 'psl-cricket-final-lahore-gaddafi-stadium',
    title: 'PSL 2026 Final | Lahore Qalandars vs. Karachi Kings',
    category: 'sports',
    subcategory: 'Cricket',
    artist: 'PSL Cricket',
    description: 'The electric final match of the Pakistan Super League live at the world-famous Gaddafi Stadium, Lahore.',
    date: '2026-11-20',
    time: '7:00 PM',
    venue: 'Gaddafi Stadium',
    venueSlug: 'gaddafi-stadium',
    city: 'Lahore',
    country: 'Pakistan',
    cityId: 'lahore',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    priceFrom: 35,
    priceTo: 500,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: true,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['psl', 'cricket', 'lahore', 'gaddafi-stadium'],
  },
  {
    id: 'e002',
    slug: 'drake-anita-max-win-tour',
    title: 'Drake | ANITA MAX WIN Tour',
    category: 'concerts',
    subcategory: 'Hip-Hop',
    artist: 'Drake',
    artistSlug: 'drake',
    description: "Drake's global headline tour featuring the complete catalog. One of the biggest hip-hop spectacles of the decade.",
    date: '2026-10-18',
    time: '8:30 PM',
    venue: 'Barclays Center',
    venueSlug: 'barclays-center',
    city: 'New York',
    country: 'USA',
    cityId: 'new-york',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    priceFrom: 75,
    priceTo: 500,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['hip-hop', 'rap', 'arena'],
  },
  {
    id: 'e003',
    slug: 'zach-bryan-american-heartbreak',
    title: 'Zach Bryan | American Heartbreak Tour',
    category: 'concerts',
    subcategory: 'Country',
    artist: 'Zach Bryan',
    artistSlug: 'zach-bryan',
    description: "Country's most authentic voice brings his American Heartbreak Tour across America's biggest arenas.",
    date: '2026-10-25',
    time: '7:30 PM',
    venue: 'United Center',
    venueSlug: 'united-center',
    city: 'Chicago',
    country: 'USA',
    cityId: 'chicago',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    priceFrom: 65,
    priceTo: 350,
    availability: 'limited',
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: false,
    isAccessible: true,
    isResale: false,
    tags: ['country', 'folk', 'arena'],
  },
  {
    id: 'e004',
    slug: 'olivia-rodrigo-guts-world-tour',
    title: 'Olivia Rodrigo | GUTS World Tour',
    category: 'concerts',
    subcategory: 'Pop',
    artist: 'Olivia Rodrigo',
    artistSlug: 'olivia-rodrigo',
    description: "GUTS World Tour extends into a triumphant global finale. Rodrigo's anthems of heartbreak fill arenas worldwide.",
    date: '2026-11-02',
    time: '7:00 PM',
    venue: 'Kia Forum',
    venueSlug: 'kia-forum',
    city: 'Los Angeles',
    country: 'USA',
    cityId: 'los-angeles',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    priceFrom: 55,
    priceTo: 280,
    availability: 'available',
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: false,
    isAccessible: true,
    isResale: false,
    tags: ['pop', 'alternative', 'arena'],
  },
  {
    id: 'e005',
    slug: 'metallica-m72-world-tour',
    title: 'Metallica | M72 World Tour',
    category: 'concerts',
    subcategory: 'Metal',
    artist: 'Metallica',
    artistSlug: 'metallica',
    description: 'No repeat setlists. Two nights. One city. Metallica returns with a revolutionary stadium concert experience.',
    date: '2026-11-14',
    time: '6:30 PM',
    venue: 'Allegiant Stadium',
    venueSlug: 'allegiant-stadium',
    city: 'Las Vegas',
    country: 'USA',
    cityId: 'las-vegas',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    priceFrom: 70,
    priceTo: 400,
    availability: 'available',
    isFeatured: true,
    isTrending: false,
    isPopular: true,
    isNearYou: false,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['metal', 'rock', 'stadium'],
  },
  // --- SPORTS ---
  {
    id: 'e006',
    slug: 'lakers-vs-celtics-nba',
    title: 'LA Lakers vs. Boston Celtics',
    category: 'sports',
    subcategory: 'Basketball',
    artist: 'NBA',
    teamSlug: 'la-lakers',
    description: 'The most storied rivalry in basketball returns. Championship contenders clash in a must-watch regular season showdown at Crypto.com Arena.',
    date: '2026-10-15',
    time: '7:30 PM',
    venue: 'Crypto.com Arena',
    venueSlug: 'crypto-com-arena',
    city: 'Los Angeles',
    country: 'USA',
    cityId: 'los-angeles',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    priceFrom: 65,
    priceTo: 800,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: true,
    isAccessible: true,
    isResale: true,
    tags: ['nba', 'basketball', 'rivalry'],
  },
  {
    id: 'e007',
    slug: 'nfl-chiefs-bills-sunday-night',
    title: 'Kansas City Chiefs vs. Buffalo Bills',
    category: 'sports',
    subcategory: 'Football',
    artist: 'NFL',
    teamSlug: 'kansas-city-chiefs',
    description: 'NFL Sunday Night Football. The two most dominant teams of the era face off for AFC supremacy.',
    date: '2026-10-20',
    time: '8:20 PM',
    venue: 'Barclays Center',
    venueSlug: 'barclays-center',
    city: 'New York',
    country: 'USA',
    cityId: 'new-york',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    priceFrom: 95,
    priceTo: 1200,
    availability: 'limited',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: true,
    isAccessible: true,
    isResale: true,
    tags: ['nfl', 'football', 'afc'],
  },
  {
    id: 'e008',
    slug: 'wwe-wrestlemania-las-vegas',
    title: 'WWE WrestleMania 42',
    category: 'sports',
    subcategory: 'Wrestling',
    artist: 'WWE',
    description: 'The Showcase of the Immortals comes to Las Vegas. Two nights of the biggest matches in sports entertainment history.',
    date: '2026-11-05',
    time: '5:00 PM',
    venue: 'Allegiant Stadium',
    venueSlug: 'allegiant-stadium',
    city: 'Las Vegas',
    country: 'USA',
    cityId: 'las-vegas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    priceFrom: 75,
    priceTo: 1500,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['wwe', 'wrestling', 'wrestlemania'],
  },
  {
    id: 'e009',
    slug: 'la-dodgers-sf-giants-mlb',
    title: 'LA Dodgers vs. San Francisco Giants',
    category: 'sports',
    subcategory: 'Baseball',
    artist: 'MLB',
    teamSlug: 'la-dodgers',
    description: "Baseball's greatest rivalry. The Dodgers host the Giants in a pennant-race showdown at the legendary Dodger Stadium.",
    date: '2026-10-08',
    time: '7:10 PM',
    venue: 'Dodger Stadium',
    venueSlug: 'dodger-stadium',
    city: 'Los Angeles',
    country: 'USA',
    cityId: 'los-angeles',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
    priceFrom: 35,
    priceTo: 450,
    availability: 'available',
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: false,
    isAccessible: true,
    isResale: false,
    tags: ['mlb', 'baseball', 'rivalry'],
  },
  // --- ARTS & THEATER ---
  {
    id: 'e010',
    slug: 'hamilton-broadway-ny',
    title: 'Hamilton',
    category: 'arts-theater',
    subcategory: 'Broadway',
    artist: 'Lin-Manuel Miranda',
    artistSlug: 'lin-manuel-miranda',
    description: "The musical that rewrote Broadway history. Lin-Manuel Miranda's Hamilton is an undeniable cultural phenomenon.",
    date: '2026-10-12',
    time: '8:00 PM',
    venue: 'Richard Rodgers Theatre',
    venueSlug: 'richard-rodgers-theatre',
    city: 'New York',
    country: 'USA',
    cityId: 'new-york',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
    priceFrom: 89,
    priceTo: 650,
    availability: 'limited',
    isFeatured: true,
    isTrending: false,
    isPopular: true,
    isNearYou: false,
    isVIP: false,
    isAccessible: true,
    isResale: true,
    tags: ['broadway', 'musical', 'theater'],
  },
  {
    id: 'e011',
    slug: 'lion-king-hollywood-bowl',
    title: 'The Lion King – Musical',
    category: 'arts-theater',
    subcategory: 'Musical',
    artist: 'Disney',
    description: "Disney's beloved The Lion King musical enchants audiences of all ages. A visual and emotional masterpiece.",
    date: '2026-10-22',
    time: '7:30 PM',
    venue: 'Crypto.com Arena',
    venueSlug: 'crypto-com-arena',
    city: 'Los Angeles',
    country: 'USA',
    cityId: 'los-angeles',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    priceFrom: 65,
    priceTo: 350,
    availability: 'available',
    isFeatured: false,
    isTrending: false,
    isPopular: true,
    isNearYou: false,
    isVIP: false,
    isAccessible: true,
    isResale: false,
    tags: ['broadway', 'musical', 'disney', 'family'],
  },
  {
    id: 'e012',
    slug: 'john-mulaney-live',
    title: 'John Mulaney | From Scratch',
    category: 'comedy',
    subcategory: 'Stand-Up',
    artist: 'John Mulaney',
    artistSlug: 'john-mulaney',
    description: "John Mulaney returns to stand-up with his most personal and hilarious special yet. The funniest man in comedy is back.",
    date: '2026-11-01',
    time: '8:00 PM',
    venue: 'Allegiant Stadium',
    venueSlug: 'allegiant-stadium',
    city: 'Las Vegas',
    country: 'USA',
    cityId: 'las-vegas',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80',
    priceFrom: 55,
    priceTo: 250,
    availability: 'available',
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: false,
    isAccessible: true,
    isResale: false,
    tags: ['comedy', 'stand-up', 'live'],
  },
  // --- FAMILY ---
  {
    id: 'e013',
    slug: 'disney-on-ice-worlds-of-enchantment',
    title: 'Disney On Ice: Worlds of Enchantment',
    category: 'family',
    subcategory: 'Ice Shows',
    artist: 'Disney On Ice',
    description: 'Dive into four dazzling Disney worlds on ice. Feature your favorite characters from Cars, Little Mermaid, Toy Story, and more.',
    date: '2026-10-30',
    time: '5:00 PM',
    venue: 'Crypto.com Arena',
    venueSlug: 'crypto-com-arena',
    city: 'Los Angeles',
    country: 'USA',
    cityId: 'los-angeles',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    priceFrom: 25,
    priceTo: 150,
    availability: 'available',
    isFeatured: false,
    isTrending: false,
    isPopular: true,
    isNearYou: false,
    isVIP: false,
    isAccessible: true,
    isResale: false,
    tags: ['family', 'disney', 'ice', 'kids'],
  },
  {
    id: 'e014',
    slug: 'coachella-valley-music-arts',
    title: 'Coachella Valley Music and Arts Festival',
    category: 'concerts',
    subcategory: 'Festival',
    artist: 'Various Artists',
    description: 'The world-famous Coachella Festival returns. Three days, dozens of stages, hundreds of artists, one unforgettable experience.',
    date: '2027-04-11',
    time: 'All Day',
    venue: 'SoFi Stadium',
    venueSlug: 'sofi-stadium',
    city: 'Los Angeles',
    country: 'USA',
    cityId: 'los-angeles',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    priceFrom: 449,
    priceTo: 1200,
    availability: 'available',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isNearYou: false,
    isVIP: true,
    isAccessible: true,
    isResale: false,
    tags: ['festival', 'pop', 'electronic', 'indie'],
  },
  {
    id: 'e015',
    slug: 'monster-jam-miami',
    title: 'Monster Jam World Finals',
    category: 'family',
    subcategory: 'Motorsports',
    artist: 'Monster Jam',
    description: 'Witness massive monster trucks battle for championship glory. High-octane family entertainment at its peak.',
    date: '2026-11-08',
    time: '2:00 PM',
    venue: 'SoFi Stadium',
    venueSlug: 'sofi-stadium',
    city: 'Miami',
    country: 'USA',
    cityId: 'miami',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    priceFrom: 20,
    priceTo: 95,
    availability: 'available',
    isFeatured: false,
    isTrending: false,
    isPopular: true,
    isNearYou: false,
    isVIP: false,
    isAccessible: true,
    isResale: false,
    tags: ['family', 'trucks', 'motorsports', 'kids'],
  },
];

// Helper getters
export const getStoredCustomEvents = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('ticketx-custom-events');
    return saved ? JSON.parse(saved) : [];
  } catch (_) {
    return [];
  }
};

export const getDeletedEventIds = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('ticketx-deleted-events');
    return saved ? JSON.parse(saved) : [];
  } catch (_) { return []; }
};

export const getEditedEvents = () => {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('ticketx-edited-events');
    return saved ? JSON.parse(saved) : {};
  } catch (_) { return {}; }
};

export const getAllEvents = () => {
  const custom = getStoredCustomEvents();
  const deletedIds = getDeletedEventIds();
  const editedDict = getEditedEvents();

  // Combine and apply overrides
  let all = [...custom, ...events];
  all = all.filter(e => !deletedIds.includes(e.id));
  
  return all.map(e => {
    if (editedDict[e.id]) {
      return { ...e, ...editedDict[e.id] };
    }
    return e;
  });
};

export const getEvents = () => getAllEvents();

export const getEventBySlug = (slug) => getAllEvents().find((e) => e.slug === slug) || null;

export const getEventsByCategory = (category, subcategory) => {
  return getAllEvents().filter((e) => {
    if (e.category !== category) return false;
    if (subcategory && subcategory !== 'all' && e.subcategory !== subcategory) return false;
    return true;
  });
};

export const getEventsByCity = (cityId) => getAllEvents().filter((e) => e.cityId === cityId);

export const getEventsByArtist = (artistSlug) => getAllEvents().filter((e) => e.artistSlug === artistSlug);

export const getEventsByTeam = (teamSlug) => getAllEvents().filter((e) => e.teamSlug === teamSlug);

export const getEventsByVenue = (venueSlug) => getAllEvents().filter((e) => e.venueSlug === venueSlug);

export const getTrendingEvents = () => getAllEvents().filter((e) => e.isTrending);

export const getFeaturedEvents = () => getAllEvents().filter((e) => e.isFeatured);

export const getPopularEvents = () => getAllEvents().filter((e) => e.isPopular);

export const getWeekendEvents = (category = 'all') => {
  const all = getAllEvents();
  if (category === 'all') return all.slice(0, 8);
  return all.filter((e) => e.category === category).slice(0, 8);
};

export const getRelatedEvents = (currentEvent) => {
  const all = getAllEvents();
  if (!currentEvent) return all.slice(0, 4);
  return all
    .filter((e) => e.id !== currentEvent.id && (e.category === currentEvent.category || e.cityId === currentEvent.cityId))
    .slice(0, 4);
};

export const searchEvents = (query) => {
  const all = getAllEvents();
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter(
    (e) =>
      e.title?.toLowerCase().includes(q) ||
      e.artist?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q) ||
      e.city?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      (e.subcategory && e.subcategory.toLowerCase().includes(q)) ||
      (e.tags && e.tags.some((t) => t.includes(q)))
  );
};

export const searchAll = (query) => {
  const all = getAllEvents();
  if (!query) return { events: all, artists, teams, venues, cities: popularCities };
  const q = query.toLowerCase();
  return {
    events: searchEvents(query),
    artists: artists.filter((a) => a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q)),
    teams: teams.filter((t) => t.name.toLowerCase().includes(q) || t.sport.toLowerCase().includes(q)),
    venues: venues.filter((v) => v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q)),
    cities: popularCities.filter((c) => c.name.toLowerCase().includes(q)),
  };
};

export const filterAndSortEvents = ({
  query,
  category,
  subcategory,
  cityId,
  priceMin,
  priceMax,
  isVIP,
  isResale,
  isAccessible,
  sortBy = 'recommended',
} = {}) => {
  let list = query ? searchEvents(query) : getAllEvents();

  if (category && category !== 'all') {
    list = list.filter((e) => e.category === category);
  }
  if (subcategory && subcategory !== 'all') {
    list = list.filter((e) => e.subcategory === subcategory);
  }
  if (cityId && cityId !== 'all') {
    list = list.filter((e) => e.cityId === cityId);
  }
  if (priceMin) {
    list = list.filter((e) => e.priceFrom >= Number(priceMin));
  }
  if (priceMax) {
    list = list.filter((e) => e.priceFrom <= Number(priceMax));
  }
  if (isVIP) {
    list = list.filter((e) => e.isVIP);
  }
  if (isResale) {
    list = list.filter((e) => e.isResale);
  }
  if (isAccessible) {
    list = list.filter((e) => e.isAccessible);
  }

  // Sorting
  if (sortBy === 'price-low') {
    list.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (sortBy === 'price-high') {
    list.sort((a, b) => b.priceFrom - a.priceFrom);
  } else if (sortBy === 'date') {
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return list;
};
