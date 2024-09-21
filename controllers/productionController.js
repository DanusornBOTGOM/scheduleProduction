const ProductionModel = require('../models/productionModel');

exports.getSchedule = async (req, res) => {
  try {
    const departments = req.query.departments ? req.query.departments.split(',') : ['Drawing'];
    console.log('Requested departments:', departments);

    const schedule = await ProductionModel.getSchedule(departments);
    console.log('Filtered schedule:', schedule);

    if (req.xhr || req.headers.accept.indexOf('application/json') > -1) {
      res.json({ schedule, departments });
    } else {
      res.render('pages/backend/production/schedule', {
        schedule,
        departments,
        layout: './layouts/backend',
        title: 'Production Schedule'
      });
    }
  } catch (error) {
    console.error('Error fetching production schedule:', error);
    if (req.xhr || req.headers.accept.indexOf('application/json') > -1) {
      res.status(500).json({ error: 'Error fetching production schedule' });
    } else {
      res.status(500).render('error', { message: 'Error fetching production schedule' });
    }
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { tasks } = req.body;
    const scheduledTasks = await ProductionModel.scheduleTasks(tasks);
    res.json(scheduledTasks);
  } catch (error) {
    console.error('Error creating production schedule:', error);
    res.status(500).json({ message: 'Error creating production schedule' });
  }
};

exports.updateProductionStatus = async (req, res) => {
  try {
    const { id, status, progress } = req.body;
    console.log('Updating status:', id, status, progress);
    const updatedItem = await ProductionModel.updateStatus(id, status, progress);
    if (updatedItem) {
      res.json({ success: true, item: updatedItem });
    } else {
      res.status(404).json({ success: false, message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating production status:', error);
    res.status(500).json({ success: false, message: 'Error updating production status' });
  }
};

exports.getProductionMetrics = async (req, res) => {
  try {
    // ในที่นี้คุณจะต้องเขียนโค้ดเพื่อคำนวณ metrics จริงๆ
    const metrics = await ProductionModel.calculateMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error calculating production metrics:', error);
    res.status(500).json({ message: 'Error fetching production metrics' });
  }
};

