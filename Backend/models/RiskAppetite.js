const mongoose = require('mongoose');

const riskAppetiteSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  maxScore: { type: Number, required: true },
  action: { type: String, required: true },
  linkedKRIs: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('RiskAppetite', riskAppetiteSchema);
