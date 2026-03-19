const mongoose = require('mongoose');

const controlSchema = new mongoose.Schema({
  controlId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  framework: { type: String, required: true },
  reference: { type: String, required: true },
  effectiveness: { type: String, enum: ['Effective', 'Partially Effective', 'Ineffective'], default: 'Partially Effective' },
  frequency: { type: String, enum: ['Continuous', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'], default: 'Monthly' },
  type: { type: String, enum: ['Preventive', 'Detective', 'Corrective'], default: 'Preventive' },
  owner: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Under Review'], default: 'Active' },
  linkedRiskIds: [{ type: String }],
  lastAssessment: { type: String, default: '' },
}, { timestamps: true });

controlSchema.pre('save', async function(next) {
  if (!this.controlId) {
    const count = await mongoose.model('Control').countDocuments();
    this.controlId = `CTL-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Control', controlSchema);
