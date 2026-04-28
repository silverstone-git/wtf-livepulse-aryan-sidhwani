const { db } = require('../db/pool');
const { gyms, checkins, payments, members, anomalies } = require('../db/schema');
const { eq, and, gte, sql, desc, asc } = require('drizzle-orm');

const statsService = {
  async getAllGyms() {
    const query = sql`
      SELECT 
        g.id, g.name, g.city, g.capacity, g.status,
        (SELECT COUNT(*)::int FROM checkins c WHERE c.gym_id = g.id AND c.checked_out IS NULL) as current_occupancy,
        (SELECT COALESCE(SUM(amount), 0)::float FROM payments p WHERE p.gym_id = g.id AND p.paid_at >= CURRENT_DATE) as today_revenue
      FROM gyms g
      ORDER BY g.name
    `;
    const { rows } = await db.execute(query);
    return rows;
  },

  async getGymLiveSnapshot(gymId) {
    const occupancyRes = await db.execute(sql`
      SELECT COUNT(*)::int as count FROM checkins WHERE gym_id = ${gymId} AND checked_out IS NULL
    `);

    const revenueRes = await db.execute(sql`
      SELECT COALESCE(SUM(amount), 0)::float as sum FROM payments WHERE gym_id = ${gymId} AND paid_at >= CURRENT_DATE
    `);

    const eventsRes = await db.execute(sql`
      SELECT 
        CASE WHEN c.checked_out IS NULL THEN 'CHECKIN' ELSE 'CHECKOUT' END as type, 
        m.name as member_name, 
        COALESCE(c.checked_out, c.checked_in) as timestamp,
        g.name as gym_name
      FROM checkins c
      JOIN members m ON c.member_id = m.id
      JOIN gyms g ON c.gym_id = g.id
      WHERE c.gym_id = ${gymId}
      ORDER BY timestamp DESC
      LIMIT 10
    `);

    const anomaliesRes = await db.execute(sql`
      SELECT * FROM anomalies WHERE gym_id = ${gymId} AND resolved = FALSE ORDER BY detected_at DESC
    `);

    return {
      occupancy: occupancyRes.rows[0].count,
      todayRevenue: revenueRes.rows[0].sum || 0,
      recentEvents: eventsRes.rows,
      activeAnomalies: anomaliesRes.rows
    };
  },

  async getGymAnalytics(gymId, dateRange = '30d') {
    const intervalStr = dateRange === '7d' ? '7 days' : (dateRange === '90d' ? '90 days' : '30 days');

    const heatmapRes = await db.execute(sql`
      SELECT day_of_week, hour_of_day, checkin_count FROM gym_hourly_stats WHERE gym_id = ${gymId}
    `);

    // Fix: Cast interval string to interval type explicitly
    const revenueByPlanRes = await db.execute(sql`
      SELECT plan_type, SUM(amount)::float as total_revenue
      FROM payments
      WHERE gym_id = ${gymId} AND paid_at >= NOW() - (${intervalStr})::interval
      GROUP BY plan_type
    `);

    const churnRiskRes = await db.execute(sql`
      SELECT id, name, last_checkin_at,
             CASE 
               WHEN last_checkin_at < NOW() - INTERVAL '60 days' THEN 'CRITICAL'
               ELSE 'HIGH'
             END as risk_level
      FROM members
      WHERE gym_id = ${gymId} AND status = 'active' AND last_checkin_at < NOW() - INTERVAL '45 days'
      ORDER BY last_checkin_at ASC
      LIMIT 50
    `);

    const ratioRes = await db.execute(sql`
      SELECT payment_type, COUNT(*)::int as count
      FROM payments
      WHERE gym_id = ${gymId} AND paid_at >= NOW() - (${intervalStr})::interval
      GROUP BY payment_type
    `);

    return {
      heatmap: heatmapRes.rows,
      revenueByPlan: revenueByPlanRes.rows,
      churnRisk: churnRiskRes.rows,
      newVsRenewal: ratioRes.rows
    };
  },

  async getCrossGymRevenue() {
    const query = sql`
      SELECT 
        g.id as gym_id, 
        g.name as gym_name, 
        SUM(p.amount)::float as total_revenue,
        RANK() OVER (ORDER BY SUM(p.amount) DESC) as rank
      FROM gyms g
      LEFT JOIN payments p ON g.id = p.gym_id AND p.paid_at >= NOW() - INTERVAL '30 days'
      GROUP BY g.id, g.name
      ORDER BY total_revenue DESC
    `;
    const { rows } = await db.execute(query);
    return rows;
  }
};

module.exports = statsService;
