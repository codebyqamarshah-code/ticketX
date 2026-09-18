import CategoryTemplate from '@/components/layout/CategoryTemplate';

export const metadata = {
  title: 'Comedy Tickets | TicketX',
  description: 'Book stand-up comedy shows, tour specials, and comedy festival tickets.',
};

export default function ComedyPage() {
  return (
    <CategoryTemplate
      title="Comedy Tickets"
      categoryKey="comedy"
      description="Laugh out loud with the world's funniest stand-up comedians, improv shows, and arena comedy tours."
      subcategories={['Stand-Up', 'Improv', 'Festivals', 'Shows']}
      heroImage="https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1600&q=80"
    />
  );
}
