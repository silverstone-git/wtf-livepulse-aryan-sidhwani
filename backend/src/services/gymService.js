const { pool } = require('../db/pool');

const gymService = {
  async getAllGyms() {
    // Return all gyms with current occupancy and today's revenue
    const query = `
      SELECT 
        g.id, g.name, g.city, g.capacity, g.status,
        (SELECT COUNT(*)::int FROM checkins c WHERE c.gym_id = g.id AND c.checked_out IS NULL) as current_occupancy,
        (SELECT COALESCE(SUM(amount), 0)::float FROM payments p WHERE p.gym_id = g.id AND p.paid_at >= CURRENT_DATE) as today_revenue
      FROM gyms g
      ORDER BY g.name
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async getGymLiveSnapshot(gymId) {
    // Current occupancy
    const occupancyRes = await pool.query(
      'SELECT COUNT(*)::int FROM checkins WHERE gym_id = $1 AND checked_out IS NULL',
      [gymId]
    );

    // Today's revenue
    const revenueRes = await pool.query(
      'SELECT COALESCE(SUM(amount), 0)::float FROM payments WHERE gym_id = $1 AND paid_at >= CURRENT_DATE',
      [gymId]
    );

    // Recent events (last 20 across all gyms for the feed, but the endpoint says snapshot for a single gym)
    // Actually spec says "recent events" for the gym snapshot.
    // Feed is usually global but let's stick to spec.
    const eventsRes = await pool.query(`
      SELECT 
        'CHECKIN' as type, 
        m.name as member_name, 
        c.checked_in as timestamp,
        g.name as gym_name
      FROM checkins c
      JOIN members m ON c.member_id = m.id
      JOIN gyms g ON c.gym_id = g.id
      WHERE c.gym_id = $1
      ORDER BY c.checked_in DESC
      LIMIT 10
    `, [gymId]);

    // Active anomalies
    const anomaliesRes = await pool.query(
      'SELECT * FROM anomalies WHERE gym_id = $1 AND resolved = FALSE ORDER BY detected_at DESC',
      [gymId]
    );

    return {
      occupancy: occupancyRes.rows[0].count,
      todayRevenue: revenueRes.rows[0].sum,
      recentEvents: eventsRes.rows,
      activeAnomalies: anomaliesRes.rows
    };
  }
};

module.exports = gymService;
