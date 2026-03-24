const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Risk = require('../models/Risk');
const Control = require('../models/Control');
const Vendor = require('../models/Vendor');
const KRI = require('../models/KRI');
const Asset = require('../models/Asset');
const Treatment = require('../models/Treatment');

router.get('/risk-assessment', protect, async (req, res) => {
  try {
    const risks = await Risk.find();
    const critical = risks.filter(r => r.riskScore >= 20).length;
    const high = risks.filter(r => r.riskScore >= 12 && r.riskScore < 20).length;
    const medium = risks.filter(r => r.riskScore >= 6 && r.riskScore < 12).length;
    const low = risks.filter(r => r.riskScore < 6).length;
    const byCategory = {};
    risks.forEach(r => { byCategory[r.category] = (byCategory[r.category] || 0) + 1; });
    res.json({ total: risks.length, critical, high, medium, low, byCategory, risks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/control-effectiveness', protect, async (req, res) => {
  try {
    const controls = await Control.find();
    const effective = controls.filter(c => c.effectiveness === 'Effective').length;
    const partial = controls.filter(c => c.effectiveness === 'Partially Effective').length;
    const ineffective = controls.filter(c => c.effectiveness === 'Ineffective').length;
    res.json({ total: controls.length, effective, partial, ineffective, rate: controls.length > 0 ? Math.round((effective / controls.length) * 100) : 0, controls });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/compliance-status', protect, async (req, res) => {
  try {
    const controls = await Control.find();
    const risks = await Risk.find();
    const frameworks = {};
    controls.forEach(c => {
      if (!frameworks[c.framework]) frameworks[c.framework] = { total: 0, effective: 0 };
      frameworks[c.framework].total++;
      if (c.effectiveness === 'Effective') frameworks[c.framework].effective++;
    });
    res.json({ frameworks, openRisks: risks.filter(r => r.status === 'Open').length, totalControls: controls.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/vendor-risk', protect, async (req, res) => {
  try {
    const vendors = await Vendor.find();
    const critical = vendors.filter(v => v.criticality === 'C').length;
    const withAgreement = vendors.filter(v => v.securityAgreement).length;
    const auditComplete = vendors.filter(v => v.auditStatus === 'Completed').length;
    res.json({ total: vendors.length, critical, withAgreement, auditComplete, vendors });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/executive-summary', protect, async (req, res) => {
  try {
    const [risks, controls, vendors, kris, assets, treatments] = await Promise.all([
      Risk.find(), Control.find(), Vendor.find(), KRI.find(), Asset.find(), Treatment.find()
    ]);
    res.json({
      assets: { total: assets.length, critical: assets.filter(a => a.classification === 'Restricted' || a.classification === 'Confidential').length },
      risks: { total: risks.length, critical: risks.filter(r => r.riskScore >= 20).length, open: risks.filter(r => r.status === 'Open').length },
      controls: { total: controls.length, effective: controls.filter(c => c.effectiveness === 'Effective').length },
      vendors: { total: vendors.length, critical: vendors.filter(v => v.criticality === 'C').length, auditComplete: vendors.filter(v => v.auditStatus === 'Completed').length },
      kris: { total: kris.length, breached: kris.filter(k => k.status === 'Breached').length },
      treatments: { total: treatments.length, completed: treatments.filter(t => t.status === 'Completed').length },
      generatedAt: new Date(),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
