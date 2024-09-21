// controllers/breakdownController.js
const { calculateProductionTime } = require('../utils/productionCalculator');
const BreakdownModel = require('../models/breakdownModel');

exports.reportBreakdown = async (req, res) => {
  const { machineId, startTime, reason, isAutoDetected } = req.body;
  try {
    const result = await BreakdownModel.reportBreakdown(machineId, new Date(startTime), reason, isAutoDetected);
    res.json({ success: true, message: 'Breakdown reported successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reporting breakdown', error: error.message });
  }
};

exports.updateBreakdown = async (req, res) => {
  const { machineId, endTime, isAutoDetected } = req.body;
  try {
    const result = await BreakdownModel.updateBreakdown(machineId, new Date(endTime), isAutoDetected);
    res.json({ success: true, message: 'Breakdown updated successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating breakdown', error: error.message });
  }
};

exports.getBreakdownUpdateForm = async (req, res) => {
  // ถ้าคุณต้องการแสดงฟอร์ม HTML
  res.render('update-breakdown-form');
  
  // หรือถ้าคุณต้องการส่งข้อมูล JSON
  // res.json({ message: 'This is the breakdown update form endpoint' });
};

exports.calculateProductionTime = async (req, res) => {
  const { weight, diameter, density, machineSpeed, startTime, includeOT } = req.body;
  try {
    const result = calculateProductionTime(
      weight,
      diameter,
      density,
      machineSpeed,
      new Date(startTime),
      includeOT
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error calculating production time', error: error.message });
  }
};