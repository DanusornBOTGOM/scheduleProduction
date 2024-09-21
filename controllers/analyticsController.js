const AnalyticsModel = require('../models/analyticsModel');

exports.getTrends = async (req, res) => {
  try {
    const trends = await AnalyticsModel.analyzeTrends();
    res.render('pages/backend/analytics/trends', {
      trends,
      layout: './layouts/backend',
      title: 'Analytics Trends'
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).render('pages/error', {
      message: 'Error fetching trends',
      layout: './layouts/backend',
      title: 'Error'
    });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    const predictions = await AnalyticsModel.predictFuturePerformance();
    res.render('pages/backend/analytics/predictions', {
      predictions,
      layout: './layouts/backend',
      title: 'Future Performance Predictions'
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).render('pages/error', {
      message: 'Error fetching predictions',
      layout: './layouts/backend',
      title: 'Error'
    });
  }
};

module.exports = {
  getTrends: exports.getTrends,
  getPredictions: exports.getPredictions
};