const { db } = require('../db/pool');
const { anomalies, gyms } = require('../db/schema');
const { eq, and, desc, sql } = require('drizzle-orm');
const { getWss } = require('../websocket/socket');

const anomalyService = {
  async getAnomalies(gymId, severity) {
    const query = db.select({
      id: anomalies.id,
      gymId: anomalies.gymId,
      type: anomalies.type,
      severity: anomalies.severity,
      message: anomalies.message,
      resolved: anomalies.resolved,
      dismissed: anomalies.dismissed,
      detectedAt: anomalies.detectedAt,
      resolvedAt: anomalies.resolvedAt,
      gym_name: gyms.name
    })
    .from(anomalies)
    .innerJoin(gyms, eq(anomalies.gymId, gyms.id))
    .where(eq(anomalies.resolved, false));

    if (gymId) {
      query.where(and(eq(anomalies.gymId, gymId)));
    }
    if (severity) {
      query.where(and(eq(anomalies.severity, severity)));
    }

    return query.orderBy(desc(anomalies.detectedAt));
  },

  async dismissAnomaly(id) {
    const existing = await db.select().from(anomalies).where(eq(anomalies.id, id)).limit(1);
    if (existing.length === 0) return null;
    
    if (existing[0].severity === 'critical') {
      throw new Error('CRITICAL_DISMISS_FORBIDDEN');
    }
    
    const updated = await db.update(anomalies)
      .set({ dismissed: true })
      .where(eq(anomalies.id, id))
      .returning();
    
    if (updated.length > 0) {
      const wss = getWss();
      if (wss) {
        wss.broadcast({
          type: 'ANOMALY_DISMISSED',
          id: id // Consistent with schema
        });
      }
    }
    
    return updated[0];
  },

  async createAnomaly(gymId, type, severity, message) {
    const existing = await db.select()
      .from(anomalies)
      .where(and(
        eq(anomalies.gymId, gymId),
        eq(anomalies.type, type),
        eq(anomalies.resolved, false)
      ))
      .limit(1);

    if (existing.length === 0) {
      const inserted = await db.insert(anomalies)
        .values({ gymId, type, severity, message })
        .returning();
      
      const anomaly = inserted[0];
      const gymData = await db.select({ name: gyms.name }).from(gyms).where(eq(gyms.id, gymId)).limit(1);
      
      const wss = getWss();
      if (wss) {
        wss.broadcast({
          type: 'ANOMALY_DETECTED',
          ...anomaly, // Spread all fields including 'id'
          gym_name: gymData[0].name
        });
      }
      return anomaly;
    }
    return null;
  },

  async resolveAnomaly(gymId, type) {
    const updated = await db.update(anomalies)
      .set({ resolved: true, resolvedAt: new Date() })
      .where(and(
        eq(anomalies.gymId, gymId),
        eq(anomalies.type, type),
        eq(anomalies.resolved, false)
      ))
      .returning();

    if (updated.length > 0) {
      const anomaly = updated[0];
      const wss = getWss();
      if (wss) {
        wss.broadcast({
          type: 'ANOMALY_RESOLVED',
          id: anomaly.id,
          resolvedAt: anomaly.resolvedAt
        });
      }
      return anomaly;
    }
    return null;
  },

  async archiveResolvedAnomalies() {
    await db.execute(sql`UPDATE anomalies SET dismissed = TRUE WHERE resolved = TRUE AND resolved_at < NOW() - INTERVAL '24 hours'`);
  }
};

module.exports = anomalyService;
