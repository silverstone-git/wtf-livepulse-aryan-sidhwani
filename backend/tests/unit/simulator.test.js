const simulator = require('../../src/jobs/simulator');
const simulatorService = require('../../src/services/simulatorService');

jest.mock('../../src/services/simulatorService', () => ({
  simulateCheckin: jest.fn(),
  simulateCheckout: jest.fn(),
  simulatePayment: jest.fn(),
}));

describe('Simulator Engine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    simulator.stop();
    jest.useRealTimers();
  });

  const flushPromises = () => new Promise(jest.requireActual('timers').setImmediate);

  it('should run ticks based on speed', async () => {
    simulator.start(1); // 2000ms
    jest.advanceTimersByTime(2005);
    await flushPromises(); // Allow async tick to complete
    expect(simulatorService.simulateCheckout).toHaveBeenCalled();
    const calls = simulatorService.simulateCheckout.mock.calls.length;
// Change speed
simulator.start(100); // 20ms
jest.advanceTimersByTime(21);
await flushPromises();
expect(simulatorService.simulateCheckout.mock.calls.length).toBeGreaterThan(calls);
const calls100 = simulatorService.simulateCheckout.mock.calls.length;

simulator.start(200); // 10ms
jest.advanceTimersByTime(11);
await flushPromises();
expect(simulatorService.simulateCheckout.mock.calls.length).toBeGreaterThan(calls100);
  });

  it('should stop correctly', async () => {
    simulator.start(1);
    simulator.stop();
    jest.advanceTimersByTime(4000);
    await flushPromises();
    expect(simulatorService.simulateCheckout).not.toHaveBeenCalled();
  });

  it('should respect probability (smoke test)', async () => {
    jest.spyOn(global.Date.prototype, 'getHours').mockReturnValue(9);
    await simulator.tick();
    expect(simulatorService.simulateCheckout).toHaveBeenCalled();
  });
});
