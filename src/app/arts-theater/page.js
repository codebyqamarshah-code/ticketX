import CategoryTemplate from '@/components/layout/CategoryTemplate';

export const metadata = {
  title: 'Arts & Theater Tickets | TicketX',
  description: 'Book Broadway, musicals, plays, opera, dance, and cultural theater performances.',
};

export default function ArtsTheaterPage() {
  return (
    <CategoryTemplate
      title="Arts & Theater Tickets"
      categoryKey="arts-theater"
      description="Immerse yourself in world-class Broadway productions, mesmerizing musicals, and performing arts."
      subcategories={['Broadway', 'Musical', 'Plays', 'Dance', 'Opera', 'Classical', 'Shows']}
      heroImage="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1600&q=80"
    />
  );
}
