import CategoryTemplate from '@/components/layout/CategoryTemplate';

export const metadata = {
  title: 'Sports Tickets | TicketX',
  description: 'Find official tickets for NBA, NFL, MLB, NHL, WWE, Soccer, and major sporting events.',
};

export default function SportsPage() {
  return (
    <CategoryTemplate
      title="Sports Tickets"
      categoryKey="sports"
      description="Be there live for legendary rivalries, championship games, and high-octane stadium action."
      subcategories={['Football', 'Basketball', 'Baseball', 'Hockey', 'Soccer', 'Wrestling', 'Motorsports', 'Tennis', 'Golf', 'Boxing']}
      heroImage="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&q=80"
    />
  );
}
