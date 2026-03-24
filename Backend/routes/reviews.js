const router = require('express').Router();
// const { protect } = require('../middleware/auth');
const Risk = require('../models/Risk');
const { sendRiskReviewNotification } = require('../utils/emailService');

// Get all risk reviews
router.get('/', /* protect, */ async (req, res) => {
  try {
    // For now, return empty array - in real implementation, store reviews in database
    res.json([]);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// Create risk review and send notification
router.post('/', /* protect, */ async (req, res) => {
  try {
    const { riskId, newStatus, newRiskLevel, comments, reviewedBy } = req.body;
    
    // Update the risk with new status
    const risk = await Risk.findOneAndUpdate(
      { riskId },
      { 
        status: newStatus,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    
    // Send email notification
    try {
      const reviewerEmail = `${reviewedBy.toLowerCase().replace(/\s+/g, '.')}@company.com`;
      await sendRiskReviewNotification(risk, reviewerEmail, comments);
      console.log(`📧 Risk review notification sent for ${riskId}`);
    } catch (emailError) {
      console.error('❌ Failed to send review notification:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({
      message: 'Risk review completed successfully',
      risk: risk,
      review: {
        id: `RVW-${Date.now()}`,
        riskId,
        newStatus,
        newRiskLevel,
        comments,
        reviewedBy,
        reviewDate: new Date().toISOString()
      }
    });
  } catch (err) { 
    res.status(400).json({ message: err.message }); 
  }
});

// Get reviews for a specific risk
router.get('/risk/:riskId', /* protect, */ async (req, res) => {
  try {
    // For now, return empty array - in real implementation, fetch from database
    res.json([]);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;
