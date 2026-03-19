const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendorId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  serviceProvided: { type: String, required: true },
  locations: [{ type: String }],
  address: {
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    pin: { type: String, default: '' },
  },
  taxDetails: {
    gst: { type: String, default: '' },
    pan: { type: String, default: '' },
  },
  criticality: { type: String, required: true, enum: ['C', 'H', 'M', 'L'] },
  managedBy: { type: String, required: true },
  securityAgreement: { type: Boolean, default: false },
  certifications: [{ type: String }],
  notes: { type: String, default: '' },
  riskScore: { type: Number, default: 0 },
  auditStatus: { type: String, enum: ['Completed', 'In Progress', 'Pending', 'Overdue'], default: 'Pending' },
  lastAuditDate: { type: String, default: '' },
}, { timestamps: true });

vendorSchema.pre('save', async function(next) {
  if (!this.vendorId) {
    const count = await mongoose.model('Vendor').countDocuments();
    this.vendorId = `VND-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
