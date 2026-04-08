const express = require('express');
const router = express.Router();
const api = require('../services/api');

// POST /api/orders/estimate
router.post('/estimate', async (req, res) => {
  try {
    // items: [{ bookUid, quantity }]
    const data = await api.estimateOrder(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const data = await api.listOrders(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:orderUid
router.get('/:orderUid', async (req, res) => {
  try {
    const data = await api.getOrder(req.params.orderUid);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// POST /api/orders
// Body: { items: [{bookUid, quantity}], shipping: { recipientName, recipientPhone, postalCode, address1, address2, shippingMemo }, externalRef }
router.post('/', async (req, res) => {
  try {
    const { items, shipping } = req.body;
    if (!items?.length || !shipping?.recipientName) {
      return res.status(400).json({
        success: false,
        message: 'items와 shipping.recipientName은 필수입니다.',
      });
    }
    const data = await api.createOrder(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// POST /api/orders/:orderUid/cancel
router.post('/:orderUid/cancel', async (req, res) => {
  try {
    const { cancelReason = '고객 요청' } = req.body;
    const data = await api.cancelOrder(req.params.orderUid, cancelReason);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

module.exports = router;
