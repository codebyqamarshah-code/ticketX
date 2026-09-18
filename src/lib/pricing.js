// Pricing helper functions for TicketX

export const SERVICE_FEE_RATE = 0.12; // 12% service fee
export const PROCESSING_FEE_FLAT = 4.50; // $4.50 flat processing fee
export const TAX_RATE = 0.08; // 8% sales tax

export function calculateTicketSubtotal(tickets = []) {
  return tickets.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
}

export function calculateServiceFee(subtotal = 0) {
  if (subtotal === 0) return 0;
  return Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
}

export function calculateProcessingFee(subtotal = 0) {
  if (subtotal === 0) return 0;
  return PROCESSING_FEE_FLAT;
}

export function calculateTaxes(subtotal = 0) {
  if (subtotal === 0) return 0;
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

export function calculateOrderTotal(tickets = []) {
  const subtotal = calculateTicketSubtotal(tickets);
  if (subtotal === 0) {
    return { subtotal: 0, serviceFee: 0, processingFee: 0, taxes: 0, total: 0 };
  }
  const serviceFee = calculateServiceFee(subtotal);
  const processingFee = calculateProcessingFee(subtotal);
  const taxes = calculateTaxes(subtotal);
  const total = Math.round((subtotal + serviceFee + processingFee + taxes) * 100) / 100;

  return {
    subtotal,
    serviceFee,
    processingFee,
    taxes,
    total,
  };
}
