const Period = require('../models/Period');
const jwt = require('jsonwebtoken');

// ✅ Secure Token Extraction & Validation
const getUserId = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Authorization header missing');

    const token = authHeader.split(' ')[1];
    if (!token) throw new Error('Token missing');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    throw new Error('Invalid or missing token');
  }
};

// ✅ Predict Period Route
exports.predictPeriod = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { startDate, cycleLength, periodLength } = req.body;

    // 🛡️ Validation
    if (!startDate || !cycleLength || !periodLength) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 📅 Date Calculations
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setUTCDate(nextPeriodDate.getUTCDate() + parseInt(cycleLength));

    const ovulationDay = new Date(nextPeriodDate);
    ovulationDay.setUTCDate(nextPeriodDate.getUTCDate() - 14);

    const fertileWindowStart = new Date(ovulationDay);
    fertileWindowStart.setUTCDate(ovulationDay.getUTCDate() - 5);
    const fertileWindowEnd = new Date(ovulationDay);
    fertileWindowEnd.setUTCDate(ovulationDay.getUTCDate() + 1);

    // 📊 Save to Database
    const newRecord = new Period({ userId, startDate, cycleLength, periodLength });
    await newRecord.save();

    // 📤 Send Response
    res.status(200).json({
      nextPeriod: nextPeriodDate.toDateString(),
      ovulationDay: ovulationDay.toDateString(),
      fertileWindowStart: fertileWindowStart.toDateString(),
      fertileWindowEnd: fertileWindowEnd.toDateString(),
    });
  } catch (err) {
    console.error('Prediction Error:', err);
    res.status(500).json({ error: err.message || 'Prediction error' });
  }
};

// ✅ Get History Route
exports.getHistory = async (req, res) => {
  try {
    const userId = getUserId(req);
    const history = await Period.find({ userId }).sort({ startDate: -1 });

    if (!history.length) {
      return res.status(404).json({ message: 'No history found' });
    }

    res.status(200).json(history);
  } catch (err) {
    console.error('History Fetch Error:', err);
    res.status(500).json({ error: err.message || 'Error fetching history' });
  }
};
