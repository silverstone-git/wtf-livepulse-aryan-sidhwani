const express = require('express');
const router = express.Router();
const anomalyService = require('../services/anomalyService');

router.get('/', async (req, res) => {
  try {
    const { gym_id, severity } = req.query;
    const anomalies = await anomalyService.getAnomalies(gym_id, severity);
    res.json(anomalies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/dismiss', async (req, res) => {
  try {
    const anomaly = await anomalyService.dismissAnomaly(req.params.id);
    if (!anomaly) return res.status(404).json({ error: 'Anomaly not found' });
    res.json(anomaly);
  } catch (err) {
    if (err.message === 'CRITICAL_DISMISS_FORBIDDEN') {
      return res.status(403).json({ error: 'Critical anomalies cannot be manually dismissed' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Test-only endpoint for reliable E2E testing
if (process.env.NODE_ENV === 'test') {
  router.post('/trigger-test', async (req, res) => {
    try {
      const { db } = require('../db/pool');
      const { gyms } = require('../db/schema');
      const firstGym = await db.select().from(gyms).limit(1);
      if (firstGym.length === 0) return res.status(404).json({error: 'No gyms found'});

      await anomalyService.createAnomaly(firstGym[0].id, 'revenue_drop', 'warning', 'E2E Test Anomaly');
      res.status(201).json({ message: 'Test anomaly triggered' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

module.exports = router;
