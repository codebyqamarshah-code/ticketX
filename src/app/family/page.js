import CategoryTemplate from '@/components/layout/CategoryTemplate';

export const metadata = {
  title: 'Family Event Tickets | TicketX',
  description: 'Book family-friendly shows, Disney on Ice, circus, and kids entertainment tickets.',
};

export default function FamilyPage() {
  return (
    <CategoryTemplate
      title="Family Event Tickets"
      categoryKey="family"
      description="Create unforgettable memories for the whole family with ice shows, circus, festivals, and magical live experiences."
      subcategories={['Ice Shows', 'Family Shows', 'Circus', 'Children\'s Theater', 'Festivals', 'Attractions']}
      heroImage="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=80"
    />
  );
}
