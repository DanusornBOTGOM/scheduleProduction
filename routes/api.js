// Import Express
const express = require('express')

// Import Moment เพื่อไว้จัดรูปแบบวันที่
const moment = require('moment')


// Import ObjectID ของ Mongodb
const objectId = require('mongodb').ObjectId

const router = express.Router()



const breakdownController = require('../controllers/breakdownController');
const energyController = require('../controllers/energyController');

router.post('/report-breakdown', breakdownController.reportBreakdown);
router.post('/update-breakdown', breakdownController.updateBreakdown);
router.get('/update-breakdown', breakdownController.getBreakdownUpdateForm); // เพิ่มบรรทัดนี้
router.post('/calculate-production-time', breakdownController.calculateProductionTime);

router.post('/energy-usage', energyController.recordUsage);
router.get('/energy-efficiency', energyController.getEfficiency);




module.exports = router
