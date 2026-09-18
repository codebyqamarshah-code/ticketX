import CategoryTemplate from '@/components/layout/CategoryTemplate';

export const metadata = {
  title: 'Concert Tickets | TicketX',
  description: 'Book concert tickets for the world\'s biggest tours, festivals, and artists.',
};

export default function ConcertsPage() {
  return (
    <CategoryTemplate
      title="Concert Tickets"
      categoryKey="concerts"
      description="Experience the magic of live music. Discover stadium tours, intimate arena shows, and iconic music festivals."
      subcategories={['Pop', 'Rock', 'Hip-Hop', 'Country', 'Metal', 'Festival', 'Electronic', 'Jazz', 'R&B']}
      heroImage="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80"
    />
  );
}
