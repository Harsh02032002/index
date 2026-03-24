const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  riskId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  subCategory: { type: String, default: '' },
  riskType: { type: String, default: '' },
  riskSource: { type: String, default: '' },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  managementAction: { type: String, enum: ['Mitigate', 'Transfer', 'Avoid', 'Accept'], default: 'Mitigate' },
  likelihood: { type: Number, required: true, min: 1, max: 5 },
  impact: { type: Number, required: true, min: 1, max: 5 },
  riskScore: { type: Number, default: 0 },
  residualLikelihood: { type: Number, min: 1, max: 5 },
  residualImpact: { type: Number, min: 1, max: 5 },
  residualScore: { type: Number },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  targetClosureDate: { type: String, default: '' },
  department: { type: String, required: true },
  owner: { type: String, required: true },
  assignedTo: {
    name: { type: String, default: '' },
    department: { type: String, default: '' },
  },
  description: { type: String, default: '' },
  threat: { type: String, default: '' },
  vulnerability: { type: String, default: '' },
  existingControls: { type: String, default: '' },
  controlEffectiveness: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  mitigationPlan: { type: String, default: '' },
  reviewDate: { type: String, default: '' },
  rationale: { type: String, default: '' },
  // Asset linkage
  linkedAssetId: { type: String, default: '' },
  linkedAssetName: { type: String, default: '' },
  linkedAssetType: { type: String, default: '' },
}, { timestamps: true });

riskSchema.pre('save', async function(next) {
  this.riskScore = this.likelihood * this.impact;
  if (this.residualLikelihood && this.residualImpact) {
    this.residualScore = this.residualLikelihood * this.residualImpact;
  }
  if (!this.riskId) {
    const count = await mongoose.model('Risk').countDocuments();
    this.riskId = `RISK-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Risk', riskSchema);
