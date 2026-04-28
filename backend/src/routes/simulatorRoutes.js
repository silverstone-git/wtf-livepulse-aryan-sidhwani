const express = require('express');
const router = express.Router();
const simulator = require('../jobs/simulator');
const simulatorService = require('../services/simulatorService');

router.get('/status', (req, res) => {
  res.json(simulator.getStatus());
});

router.post('/start', (req, res) => {
  const { speed } = req.body;
  simulator.start(speed);
  res.json({ status: 'running', speed });
});

router.post('/stop', (req, res) => {
  simulator.stop();
  res.json({ status: 'paused' });
});

router.post('/reset', async (req, res) => {
  simulator.stop();
  simulator.resetSpeed();
  const result = await simulatorService.reset();
  res.json(result);
});

module.exports = router;
