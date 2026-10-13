import mongoose from 'mongoose';

const TicketTypeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  totalQuantity: { type: Number, required: true, min: 0 },
  availableQuantity: { type: Number, required: true, min: 0 },
  maxPerCustomer: { type: Number, default: 8 },
  saleStart: { type: String, default: '' },
  saleEnd: { type: String, default: '' },
  section: { type: String, default: 'General Admission' },
  status: { type: String, enum: ['Available', 'Sold Out', 'Hidden'], default: 'Available' }
}, { _id: false });

const EventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  artistSlug: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  description: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, default: 'USA' },
  cityId: { type: String },
  venue: { type: String, required: true },
  venueSlug: { type: String },
  venueAddress: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  endTime: { type: String, default: '' },
  timezone: { type: String, default: 'America/New_York' },
  image: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Sold Out', 'Cancelled', 'Past Event'], 
    default: 'Published' 
  },
  ticketTypes: [TicketTypeSchema],
  priceFrom: { type: Number, default: 0 },
  priceTo: { type: Number, default: 0 },
  availableSeats: { type: Number, default: 0 },
  totalCapacity: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isVIP: { type: Boolean, default: false },
  isAccessible: { type: Boolean, default: true },
  isResale: { type: Boolean, default: false },
  tags: [{ type: String }],
  uploadedByAdmin: { type: Boolean, default: true },
  createdBy: { type: String, default: 'Super Admin' },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
