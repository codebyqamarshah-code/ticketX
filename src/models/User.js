import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  city: { type: String, default: 'New York' },
  country: { type: String, default: 'USA' },
  avatar: { type: String, default: null },
  role: { type: String, enum: ['user', 'super_admin'], default: 'user' },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  emailVerified: { type: Boolean, default: false },
  emailVerificationOtpHash: { type: String },
  emailVerificationOtpExpiresAt: { type: Date },
  emailVerificationAttempts: { type: Number, default: 0 },
  emailVerificationLastSentAt: { type: Date }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
