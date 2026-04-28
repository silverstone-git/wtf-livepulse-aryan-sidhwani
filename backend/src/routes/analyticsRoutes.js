const express = require('express');
const router = express.Router();
const statsService = require('../services/statsService');

router.get('/cross-gym', async (req, res) => {
  try {
    const data = await statsService.getCrossGymRevenue();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:gymId', async (req, res) => {
  try {
    const { dateRange } = req.query;
    const data = await statsService.getGymAnalytics(req.params.gymId, dateRange);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
