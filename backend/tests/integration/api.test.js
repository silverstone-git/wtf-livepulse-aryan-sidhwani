const request = require('supertest');
const { pool } = require('../../src/db/pool');

describe('API Integration Tests', () => {
  const API_URL = 'http://localhost:3001';
  let gymId;
  let warningAnomalyId;
  let criticalAnomalyId;

  beforeAll(async () => {
    // 1. Get a valid gym
    const { rows } = await pool.query('SELECT id FROM gyms LIMIT 1');
    gymId = rows[0].id;

    // 2. Insert test anomalies for dismissal tests
    const wRes = await pool.query(
      "INSERT INTO anomalies (gym_id, type, severity, message) VALUES ($1, 'revenue_drop', 'warning', 'Test Warning') RETURNING id",
      [gymId]
    );
    warningAnomalyId = wRes.rows[0].id;

    const cRes = await pool.query(
      "INSERT INTO anomalies (gym_id, type, severity, message) VALUES ($1, 'capacity_breach', 'critical', 'Test Critical') RETURNING id",
      [gymId]
    );
    criticalAnomalyId = cRes.rows[0].id;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM anomalies WHERE message LIKE \'Test%\'');
    await pool.end();
  });

  describe('Gyms & Live Data', () => {
    it('should return all gyms with occupancy/revenue (1)', async () => {
      const res = await request(API_URL).get('/api/gyms');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThanOrEqual(10);
    });

    it('should return live snapshot for valid gym (2)', async () => {
      const res = await request(API_URL).get(`/api/gyms/${gymId}/live`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('occupancy');
      expect(res.body).toHaveProperty('todayRevenue');
    });

    it('should return 500 for invalid gym UUID (3)', async () => {
      const res = await request(API_URL).get('/api/gyms/not-a-uuid/live');
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('Analytics', () => {
    it('should return cross-gym revenue comparison (4)', async () => {
      const res = await request(API_URL).get('/api/analytics/cross-gym');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('total_revenue');
    });

    it('should return detailed analytics for a gym (5)', async () => {
      const res = await request(API_URL).get(`/api/analytics/${gymId}?dateRange=30d`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('heatmap');
      expect(res.body).toHaveProperty('churnRisk');
    });
  });

  describe('Anomalies', () => {
    it('should list all active anomalies (6)', async () => {
      const res = await request(API_URL).get('/api/anomalies');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter anomalies by severity (7)', async () => {
      const res = await request(API_URL).get('/api/anomalies?severity=critical');
      expect(res.statusCode).toEqual(200);
      const allCritical = res.body.every(a => a.severity === 'critical');
      expect(allCritical).toBeTruthy();
    });

    it('should allow dismissing a warning anomaly (8)', async () => {
      const res = await request(API_URL).patch(`/api/anomalies/${warningAnomalyId}/dismiss`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.dismissed).toBeTruthy();
    });

    it('should return 403 when dismissing a critical anomaly (9)', async () => {
      const res = await request(API_URL).patch(`/api/anomalies/${criticalAnomalyId}/dismiss`);
      expect(res.statusCode).toEqual(403);
    });

    it('should return 404 for non-existent anomaly dismissal (10)', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(API_URL).patch(`/api/anomalies/${fakeId}/dismiss`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('Simulator Controls', () => {
    it('should start simulator (11)', async () => {
      const res = await request(API_URL).post('/api/simulator/start').send({ speed: 1 });
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('running');
    });

    it('should stop simulator (12)', async () => {
      const res = await request(API_URL).post('/api/simulator/stop');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('paused');
    });

    it('should reset live data (13)', async () => {
      const res = await request(API_URL).post('/api/simulator/reset');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('reset');
    });
  });
});
