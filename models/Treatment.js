const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  treatmentId: { type: String, unique: true },
  linkedRiskId: { type: String, required: true },
  linkedRiskTitle: { type: String, default: '' },
  type: { type: String, enum: ['Mitigate', 'Accept', 'Transfer', 'Avoid'], default: 'Mitigate' },
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], default: 'Planned' },
  owner: { type: String, required: true },
  dueDate: { type: String, default: '' },
  plan: { type: String, required: true },
  completionDate: { type: String, default: '' },
}, { timestamps: true });

treatmentSchema.pre('save', async function(next) {
  if (!this.treatmentId) {
    const count = await mongoose.model('Treatment').countDocuments();
    this.treatmentId = `TRT-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Treatment', treatmentSchema);
