const mongoose = require('mongoose');

const kriSchema = new mongoose.Schema({
  kriId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Leading', 'Lagging'], required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  thresholds: {
    amber: { type: Number, required: true },
    red: { type: Number, required: true },
  },
  trend: { type: String, enum: ['Improving', 'Stable', 'Declining'], default: 'Stable' },
  status: { type: String, enum: ['Safe', 'Warning', 'Breached'], default: 'Safe' },
  linkedRiskId: { type: String, default: '' },
  lastUpdated: { type: String, default: '' },
}, { timestamps: true });

kriSchema.pre('save', function(next) {
  // Auto-calculate status from thresholds
  if (this.value <= this.thresholds.red) this.status = 'Breached';
  else if (this.value <= this.thresholds.amber) this.status = 'Warning';
  else this.status = 'Safe';

  if (!this.kriId) {
    mongoose.model('KRI').countDocuments().then(count => {
      this.kriId = `KRI-${String(count + 1).padStart(3, '0')}`;
      next();
    });
  } else {
    next();
  }
});

module.exports = mongoose.model('KRI', kriSchema);
