const anomalyDetector = require('../../src/jobs/anomalyDetector');
const { pool } = require('../../src/db/pool');
const anomalyService = require('../../src/services/anomalyService');

jest.mock('../../src/db/pool', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('../../src/services/anomalyService', () => ({
  createAnomaly: jest.fn(),
  resolveAnomaly: jest.fn(),
  archiveResolvedAnomalies: jest.fn(),
}));

describe('Anomaly Detector Logic', () => {
  const mockGym = { id: 'gym-123', name: 'Test Gym', capacity: 100 };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('checkZeroCheckins', () => {
    it('should fire WARNING when zero checkins in last 2 hours during operating hours', async () => {
      // Mock getHours to return 10
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(10);
      pool.query.mockResolvedValueOnce({ rows: [{ count: '0' }] });

      await anomalyDetector.checkZeroCheckins(mockGym);

      expect(anomalyService.createAnomaly).toHaveBeenCalledWith(
        mockGym.id,
        'zero_checkins',
        'warning',
        expect.stringContaining('No check-ins recorded')
      );
    });

    it('should NOT fire when outside operating hours', async () => {
      // Mock getHours to return 2 (AM)
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(2);

      await anomalyDetector.checkZeroCheckins(mockGym);

      expect(pool.query).not.toHaveBeenCalled();
      expect(anomalyService.createAnomaly).not.toHaveBeenCalled();
    });

    it('should resolve when checkins are found', async () => {
      jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(10);
      pool.query.mockResolvedValueOnce({ rows: [{ count: '5' }] });

      await anomalyDetector.checkZeroCheckins(mockGym);

      expect(anomalyService.resolveAnomaly).toHaveBeenCalledWith(mockGym.id, 'zero_checkins');
    });
  });

  describe('checkCapacityBreach', () => {
    it('should fire CRITICAL when occupancy > 90%', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ count: 91 }] });

      await anomalyDetector.checkCapacityBreach(mockGym);

      expect(anomalyService.createAnomaly).toHaveBeenCalledWith(
        mockGym.id,
        'capacity_breach',
        'critical',
        expect.stringContaining('91.0%')
      );
    });

    it('should resolve when occupancy < 85%', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ count: 84 }] });

      await anomalyDetector.checkCapacityBreach(mockGym);

      expect(anomalyService.resolveAnomaly).toHaveBeenCalledWith(mockGym.id, 'capacity_breach');
    });
  });

  describe('checkRevenueDrop', () => {
    it('should fire WARNING when today revenue < 70% of last week', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ sum: 500 }] })
        .mockResolvedValueOnce({ rows: [{ sum: 1000 }] });

      await anomalyDetector.checkRevenueDrop(mockGym);

      expect(anomalyService.createAnomaly).toHaveBeenCalledWith(
        mockGym.id,
        'revenue_drop',
        'warning',
        expect.stringContaining('50.0%')
      );
    });

    it('should resolve when revenue recovers within 20%', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ sum: 900 }] })
        .mockResolvedValueOnce({ rows: [{ sum: 1000 }] });

      await anomalyDetector.checkRevenueDrop(mockGym);

      expect(anomalyService.resolveAnomaly).toHaveBeenCalledWith(mockGym.id, 'revenue_drop');
    });
  });
});
