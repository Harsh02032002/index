const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Risk = require('../models/Risk');

// Get all
router.get('/', protect, async (req, res) => {
  try {
    const items = await Risk.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create
router.post('/', protect, async (req, res) => {
  try {
    const item = await Risk.create(req.body);
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Update
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Risk.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Risk.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Load sample data
router.post('/sample-data', async (req, res) => {
  try {
    await Risk.deleteMany({});
    const sampleData = require('../utils/sampleData').sampleRisks;
    const items = await Risk.insertMany(sampleData);
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
