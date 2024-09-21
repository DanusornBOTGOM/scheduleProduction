// controllers/energyController.js
const EnergyModel = require('../models/energyModel');

exports.recordUsage = async (req, res) => {
  const { machineId, energyUsage, timestamp } = req.body;
  try {
    const result = await EnergyModel.recordEnergyUsage(machineId, energyUsage, new Date(timestamp));
    res.json({ success: true, message: 'Energy usage recorded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recording energy usage', error: error.message });
  }
};

exports.getEfficiency = async (req, res) => {
  const { machineId, startDate, endDate } = req.query;
  try {
    const efficiency = await EnergyModel.analyzeEnergyEfficiency(machineId, new Date(startDate), new Date(endDate));
    res.json(efficiency);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error analyzing energy efficiency', error: error.message });
  }
};