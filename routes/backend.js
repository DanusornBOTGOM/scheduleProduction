// Import Express
const express = require('express')

// Import Moment เพื่อไว้จัดรูปแบบวันที่
const moment = require('moment')

// Import CSV
const createCsvWriter = require('csv-writer').createObjectCsvWriter

//Import html=pdf
const ejs = require('ejs')
const pdf = require('html-pdf')
const path = require('path')

const router = express.Router()

const inventoryController = require('../controllers/inventoryController');
const productionController = require('../controllers/productionController');
const analyticsController = require('../controllers/analyticsController');

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke in backend routes!');
});

// Inventory routes
router.get('/inventory', inventoryController.index);
router.post('/inventory/update', inventoryController.update);
router.get('/inventory/low-stock', inventoryController.getLowStock);

// Production routes
router.get('/production/schedule', productionController.getSchedule);
router.post('/production/schedule/create', productionController.createSchedule);
router.post('/production-schedule/update', productionController.updateProductionStatus);
router.get('/production-metrics', productionController.getProductionMetrics);

// Analytics routes
router.get('/analytics/trends', analyticsController.getTrends);
router.get('/analytics/predictions', analyticsController.getPredictions);

router.post('/production-schedule/update', productionController.updateProductionStatus);
router.get('/production-metrics', productionController.getProductionMetrics);


module.exports = router