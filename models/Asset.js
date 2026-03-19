const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['Laptop', 'Server', 'Network Device', 'Application', 'Database', 'Mobile Device', 'IoT Device', 'Cloud Service'] },
  classification: { type: String, required: true, enum: ['Public', 'Internal', 'Confidential', 'Restricted'] },
  owner: { type: String, required: true },
  environment: { type: String, required: true, enum: ['Production', 'Development', 'Staging', 'Testing', 'DR'] },
  department: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive', 'Decommissioned'], default: 'Active' },
}, { timestamps: true });

assetSchema.pre('save', async function(next) {
  if (!this.assetId) {
    const count = await mongoose.model('Asset').countDocuments();
    this.assetId = `AST-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Asset', assetSchema);
