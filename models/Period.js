const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  cycleLength: { type: Number, required: true },
  periodLength: { type: Number, required: true },
});

module.exports = mongoose.model('Period', periodSchema);
