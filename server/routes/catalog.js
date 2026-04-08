const express = require('express');
const router = express.Router();
const api = require('../services/api');

// GET /api/catalog/book-specs
router.get('/book-specs', async (req, res) => {
  try {
    const data = await api.listBookSpecs();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/catalog/templates
router.get('/templates', async (req, res) => {
  try {
    const qs = new URLSearchParams(req.query).toString();
    const data = await api.listTemplates(qs);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/catalog/template-categories
router.get('/template-categories', async (req, res) => {
  try {
    const data = await api.listTemplateCategories();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/catalog/credits
router.get('/credits', async (req, res) => {
  try {
    const data = await api.getCredits();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/catalog/credits/sandbox-charge  (테스트 충전)
router.post('/credits/sandbox-charge', async (req, res) => {
  try {
    const { amount = 100000, memo = '테스트 충전' } = req.body;
    const data = await api.sandboxCharge(amount, memo);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
