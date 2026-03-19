require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { sampleAssets, sampleVendors, sampleRisks, sampleKRIs, sampleControls, sampleTreatments, sampleRiskAppetite } = require('./sampleData');

const Asset = require('../models/Asset');
const Vendor = require('../models/Vendor');
const Risk = require('../models/Risk');
const KRI = require('../models/KRI');
const Control = require('../models/Control');
const Treatment = require('../models/Treatment');
const RiskAppetite = require('../models/RiskAppetite');
const User = require('../models/User');

const seed = async () => {
  await connectDB();
  console.log('Seeding database...');

  await Promise.all([
    Asset.deleteMany({}), Vendor.deleteMany({}), Risk.deleteMany({}),
    KRI.deleteMany({}), Control.deleteMany({}), Treatment.deleteMany({}),
    RiskAppetite.deleteMany({}),
  ]);

  await Asset.insertMany(sampleAssets);
  await Vendor.insertMany(sampleVendors);
  await Risk.insertMany(sampleRisks);
  await KRI.insertMany(sampleKRIs);
  await Control.insertMany(sampleControls);
  await Treatment.insertMany(sampleTreatments);
  await RiskAppetite.insertMany(sampleRiskAppetite);

  // Create default admin user
  const existing = await User.findOne({ email: 'admin@nexusgrc.com' });
  if (!existing) {
    await User.create({ name: 'Admin', email: 'admin@nexusgrc.com', password: 'admin123', role: 'admin', department: 'IT' });
    console.log('Default admin created: admin@nexusgrc.com / admin123');
  }

  console.log('Database seeded successfully!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
