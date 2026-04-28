const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

router.get('/', async (req, res) => {
  try {
    const { gym_id } = req.query;
    let query = 'SELECT id, name, email, phone, status, plan_type FROM members';
    const params = [];
    if (gym_id) {
      query += ' WHERE gym_id = $1';
      params.push(gym_id);
    }
    query += ' LIMIT 100';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
