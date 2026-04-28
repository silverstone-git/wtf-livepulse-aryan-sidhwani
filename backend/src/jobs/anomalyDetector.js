const { pool } = require('../db/pool');
const anomalyService = require('../services/anomalyService');

const anomalyDetector = {
  async run() {
    console.log('[Anomaly Detector] Running cycle...');
    try {
      const { rows: gyms } = await pool.query('SELECT * FROM gyms WHERE status = $1', ['active']);
      
      for (const gym of gyms) {
        await this.checkZeroCheckins(gym);
        await this.checkCapacityBreach(gym);
        await this.checkRevenueDrop(gym);
      }
      
      await anomalyService.archiveResolvedAnomalies();

    } catch (err) {
      console.error('[Anomaly Detector] Error:', err.message);
    }
  },

  async checkZeroCheckins(gym) {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6 || hour >= 22) {
      return;
    }

    const { rows } = await pool.query(`
      SELECT COUNT(*) FROM checkins 
      WHERE gym_id = $1 AND checked_in >= NOW() - INTERVAL '2 hours'
    `, [gym.id]);

    if (parseInt(rows[0].count) === 0) {
      await anomalyService.createAnomaly(gym.id, 'zero_checkins', 'warning', `No check-ins recorded for ${gym.name} in the last 2 hours.`);
    } else {
      await anomalyService.resolveAnomaly(gym.id, 'zero_checkins');
    }
  },

  async checkCapacityBreach(gym) {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int as count FROM checkins WHERE gym_id = $1 AND checked_out IS NULL',
      [gym.id]
    );
    const occupancy = rows[0].count;
    const pct = (occupancy / gym.capacity) * 100;

    if (pct > 90) {
      await anomalyService.createAnomaly(gym.id, 'capacity_breach', 'critical', `Capacity breach at ${gym.name}: ${occupancy}/${gym.capacity} (${pct.toFixed(1)}%)`);
    } else if (pct < 85) {
      await anomalyService.resolveAnomaly(gym.id, 'capacity_breach');
    }
  },

  async checkRevenueDrop(gym) {
    const todayRes = await pool.query(
      "SELECT COALESCE(SUM(amount), 0)::float as sum FROM payments WHERE gym_id = $1 AND paid_at >= CURRENT_DATE",
      [gym.id]
    );
    const todayRev = todayRes.rows[0].sum;

    const lastWeekRes = await pool.query(`
      SELECT COALESCE(SUM(amount), 0)::float as sum 
      FROM payments 
      WHERE gym_id = $1 
      AND paid_at >= (CURRENT_DATE - INTERVAL '7 days') 
      AND paid_at < (CURRENT_DATE - INTERVAL '6 days')
    `, [gym.id]);
    const lastWeekRev = lastWeekRes.rows[0].sum;

    if (lastWeekRev > 0) {
      const drop = ((lastWeekRev - todayRev) / lastWeekRev) * 100;
      if (drop >= 30) {
        await anomalyService.createAnomaly(gym.id, 'revenue_drop', 'warning', `Revenue drop at ${gym.name}: ₹${todayRev} today vs ₹${lastWeekRev} last week (-${drop.toFixed(1)}%)`);
      } else if (drop <= 20) {
        await anomalyService.resolveAnomaly(gym.id, 'revenue_drop');
      }
    }
  }
};

module.exports = anomalyDetector;
