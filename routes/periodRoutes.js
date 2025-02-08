const express = require('express');
const { predictPeriod, getHistory } = require('../controller/periodController.js'); // Correct import

const router = express.Router();

// ✅ Correct routes
router.post('/predict', predictPeriod);
router.get('/history', getHistory);

module.exports = router;
