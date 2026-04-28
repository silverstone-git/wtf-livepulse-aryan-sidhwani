const { pool } = require('../db/pool');

const analyticsService = {
  async getGymAnalytics(gymId, dateRange = '30d') {
    const interval = dateRange === '7d' ? '7 days' : (dateRange === '90d' ? '90 days' : '30 days');

    // 1. Peak hours heatmap (from materialized view)
    const heatmapRes = await pool.query(
      'SELECT day_of_week, hour_of_day, checkin_count FROM gym_hourly_stats WHERE gym_id = $1',
      [gymId]
    );

    // 2. Revenue by plan type
    const revenueByPlanRes = await pool.query(`
      SELECT plan_type, SUM(amount)::float as total_revenue
      FROM payments
      WHERE gym_id = $1 AND paid_at >= NOW() - INTERVAL '${interval}'
      GROUP BY plan_type
    `, [gymId]);

    // 3. Churn risk members (active members, last checkin > 45 days)
    const churnRiskRes = await pool.query(`
      SELECT id, name, last_checkin_at,
             CASE 
               WHEN last_checkin_at < NOW() - INTERVAL '60 days' THEN 'CRITICAL'
               ELSE 'HIGH'
             END as risk_level
      FROM members
      WHERE gym_id = $1 AND status = 'active' AND last_checkin_at < NOW() - INTERVAL '45 days'
      ORDER BY last_checkin_at ASC
      LIMIT 50
    `, [gymId]);

    // 4. New vs Renewal ratio
    const ratioRes = await pool.query(`
      SELECT payment_type, COUNT(*)::int as count
      FROM payments
      WHERE gym_id = $1 AND paid_at >= NOW() - INTERVAL '${interval}'
      GROUP BY payment_type
    `, [gymId]);

    return {
      heatmap: heatmapRes.rows,
      revenueByPlan: revenueByPlanRes.rows,
      churnRisk: churnRiskRes.rows,
      newVsRenewal: ratioRes.rows
    };
  },

  async getCrossGymRevenue() {
    const query = `
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
    const { rows } = await pool.query(query);
    return rows;
  }
};

module.exports = analyticsService;
