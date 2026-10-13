import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  ticketId: { type: String },
  ticketTypeId: { type: String },
  ticketType: { type: String, default: 'General Admission' },
  eventTitle: { type: String, required: true },
  eventSlug: { type: String },
  eventId: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  sectionName: { type: String, default: 'General' },
  row: { type: String, default: '1' },
  seatNumber: { type: String, default: 'GA' },
  validationStatus: { type: String, enum: ['Valid', 'Used', 'Cancelled'], default: 'Valid' },
  qrCodeRef: { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, default: null },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: 'USA' }
  },
  eventTitle: { type: String, required: true },
  eventSlug: { type: String, default: '' },
  eventId: { type: String, default: '' },
  ticketType: { type: String, default: 'General Admission' },
  quantity: { type: Number, required: true, min: 1 },
  currency: { type: String, default: 'USD' },
  pricing: {
    subtotal: { type: Number, required: true },
    serviceFee: { type: Number, default: 0 },
    facilityFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }
  },
  items: [OrderItemSchema],
  payment: {
    method: { type: String, default: 'Credit Card' },
    cardBrand: { type: String, default: 'Visa' },
    last4: { type: String, default: '4242' },
    status: { type: String, enum: ['Paid', 'Pending', 'Failed', 'Refunded'], default: 'Paid' },
    transactionId: { type: String, default: '' }
  },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Cancelled', 'Refunded'], 
    default: 'Confirmed' 
  },
  refundReason: { type: String, default: '' },
  refundedAt: { type: Date, default: null },
  cancellationReason: { type: String, default: '' },
  cancelledAt: { type: Date, default: null },
  confirmationEmailSentAt: { type: Date, default: null },
  confirmationEmailCount: { type: Number, default: 1 },
  timeline: [{
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' },
    actor: { type: String, default: 'System' }
  }],
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
