const { db } = require('../db/pool');
const { gyms, checkins, members, payments, anomalies } = require('../db/schema');
const { eq, and, sql, isNull, lt, or } = require('drizzle-orm');
const { getWss } = require('../websocket/socket');

const simulatorService = {
  async simulateCheckin(timestamp = new Date()) {
    const activeGyms = await db.select().from(gyms).where(eq(gyms.status, 'active'));
    if (activeGyms.length === 0) return;
    const gym = activeGyms[Math.floor(Math.random() * activeGyms.length)];

    const candidateMembers = await db.select({ id: members.id, name: members.name })
      .from(members)
      .where(and(eq(members.gymId, gym.id), eq(members.status, 'active')))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    
    if (candidateMembers.length === 0) return;
    const member = candidateMembers[0];

    const activeCheckin = await db.select()
      .from(checkins)
      .where(and(eq(checkins.memberId, member.id), isNull(checkins.checkedOut)))
      .limit(1);
    
    if (activeCheckin.length > 0) return;

    const inserted = await db.insert(checkins)
      .values({ gymId: gym.id, memberId: member.id, checkedIn: timestamp })
      .returning();

    const countRes = await db.execute(sql`SELECT COUNT(*)::int as count FROM checkins WHERE gym_id = ${gym.id} AND checked_out IS NULL`);
    const occupancy = countRes.rows[0].count;

    const wss = getWss();
    if (wss) {
      wss.broadcast({
        type: 'CHECKIN_EVENT',
        gym_id: gym.id,
        member_name: member.name,
        timestamp: inserted[0].checkedIn,
        current_occupancy: occupancy,
        capacity_pct: (occupancy / gym.capacity) * 100,
        simulatedTime: timestamp.toISOString()
      });
    }
  },

  async simulateCheckout(timestamp = new Date()) {
    // Pick a random gym to check for checkouts, ensuring all gyms get updated
    const activeGyms = await db.select().from(gyms).where(eq(gyms.status, 'active'));
    if (activeGyms.length === 0) return;
    const gym = activeGyms[Math.floor(Math.random() * activeGyms.length)];

    const checkoutCandidates = await db.select({ id: checkins.id, memberId: checkins.memberId })
      .from(checkins)
      .where(and(
        eq(checkins.gymId, gym.id),
        isNull(checkins.checkedOut),
        or(
          lt(checkins.checkedIn, sql`${timestamp}::timestamp - INTERVAL '45 minutes'`),
          and(lt(checkins.checkedIn, sql`${timestamp}::timestamp - INTERVAL '5 minutes'`), sql`RANDOM() < 0.05`)
        )
      ))
      .limit(1);

    if (checkoutCandidates.length > 0) {
      const coId = checkoutCandidates[0].id;
      const updated = await db.update(checkins)
        .set({ checkedOut: timestamp })
        .where(eq(checkins.id, coId))
        .returning();
      
      const co = updated[0];
      const memberData = await db.select({ name: members.name }).from(members).where(eq(members.id, co.memberId)).limit(1);
      const countRes = await db.execute(sql`SELECT COUNT(*)::int as count FROM checkins WHERE gym_id = ${co.gymId} AND checked_out IS NULL`);
      const occupancy = countRes.rows[0].count;

      const wss = getWss();
      if (wss) {
        wss.broadcast({
          type: 'CHECKOUT_EVENT',
          gym_id: co.gym_id,
          member_name: memberData[0].name,
          timestamp: co.checkedOut,
          current_occupancy: occupancy,
          capacity_pct: (occupancy / gym.capacity) * 100,
          simulatedTime: timestamp.toISOString()
        });
      }
    }
  },

  async simulatePayment(timestamp = new Date()) {
    const activeGyms = await db.select().from(gyms).where(eq(gyms.status, 'active'));
    if (activeGyms.length === 0) return;
    const gym = activeGyms[Math.floor(Math.random() * activeGyms.length)];
    
    const candidateMembers = await db.select()
      .from(members)
      .where(eq(members.gymId, gym.id))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    
    if (candidateMembers.length === 0) return;
    const member = candidateMembers[0];

    const prices = { monthly: '1499.00', quarterly: '3999.00', annual: '11999.00' };
    const amount = prices[member.planType] || '1499.00';

    await db.insert(payments).values({
      gymId: gym.id,
      memberId: member.id,
      amount: amount,
      planType: member.planType,
      paymentType: 'renewal',
      paidAt: timestamp
    });

    const totalRes = await db.execute(sql`SELECT SUM(amount)::float as sum FROM payments WHERE gym_id = ${gym.id} AND paid_at >= ${timestamp.toISOString()}::date`);

    const wss = getWss();
    if (wss) {
      wss.broadcast({
        type: 'PAYMENT_EVENT',
        gym_id: gym.id,
        amount: parseFloat(amount),
        plan_type: member.planType,
        member_name: member.name,
        today_total: totalRes.rows[0].sum,
        simulatedTime: timestamp.toISOString()
      });
    }
  },

  async reset() {
    await db.delete(checkins).where(isNull(checkins.checkedOut));
    await db.delete(anomalies);
    return { status: 'reset' };
  }
};

module.exports = simulatorService;
