import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true, enum: ['USER', 'EVENT', 'ORDER', 'SYSTEM'] },
  targetId: { type: String, default: '' },
  details: { type: String, default: '' },
  ipAddress: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
