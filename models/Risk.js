const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  riskId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  managementAction: { type: String, enum: ['Mitigate', 'Transfer', 'Avoid', 'Accept'], default: 'Mitigate' },
  likelihood: { type: Number, required: true, min: 1, max: 5 },
  impact: { type: Number, required: true, min: 1, max: 5 },
  riskScore: { type: Number, default: 0 },
  residualLikelihood: { type: Number, min: 1, max: 5 },
  residualImpact: { type: Number, min: 1, max: 5 },
  residualScore: { type: Number },
  department: { type: String, required: true },
  owner: { type: String, required: true },
  assignedTo: {
    name: { type: String, default: '' },
    department: { type: String, default: '' },
  },
  description: { type: String, default: '' },
  mitigationPlan: { type: String, default: '' },
  reviewDate: { type: String, default: '' },
  rationale: { type: String, default: '' },
}, { timestamps: true });

riskSchema.pre('save', async function(next) {
  this.riskScore = this.likelihood * this.impact;
  if (this.residualLikelihood && this.residualImpact) {
    this.residualScore = this.residualLikelihood * this.residualImpact;
  }
  if (!this.riskId) {
    const count = await mongoose.model('Risk').countDocuments();
    this.riskId = `RSK-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Risk', riskSchema);
