const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Vendor = require('../models/Vendor');

// Get all
router.get('/', protect, async (req, res) => {
  try {
    const items = await Vendor.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create
router.post('/', protect, async (req, res) => {
  try {
    const item = await Vendor.create(req.body);
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Update
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Vendor.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Load sample data
router.post('/sample-data', async (req, res) => {
  try {
    await Vendor.deleteMany({});
    const sampleData = require('../utils/sampleData').sampleVendors;
    const items = await Vendor.insertMany(sampleData);
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Vendor risk report
router.get('/:id/report', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    const Risk = require('../models/Risk');
    const risks = await Risk.find({ category: 'Vendor Risk' });
    res.json({ vendor, relatedRisks: risks, generatedAt: new Date() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
