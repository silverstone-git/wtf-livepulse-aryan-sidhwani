const simulatorService = require('../services/simulatorService');

let isRunning = false;
let speed = 1;
let intervalId = null;
let simulatedTime = new Date();

function gaussian(x, mu, sigma) {
  return Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
}

const simulator = {
  start(newSpeed = 1) {
    speed = newSpeed;
    if (isRunning) {
      clearInterval(intervalId);
    }
    isRunning = true;
    const tickRate = 2000 / speed;
    intervalId = setInterval(() => this.tick(), tickRate);
    console.log(`[Simulator] Started at ${speed}x speed (tick every ${tickRate}ms)`);
  },

  stop() {
    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    console.log('[Simulator] Stopped');
  },

  resetSpeed() {
    speed = 1;
    console.log('[Simulator] Speed reset to 1x');
  },

  getStatus() {
    return { isRunning, speed, simulatedTime: simulatedTime.toISOString() };
  },

  async tick() {
    try {
      const secondsToAdvance = 2 * speed;
      simulatedTime = new Date(simulatedTime.getTime() + secondsToAdvance * 1000);

      // Broadcast clock update
      const { getWss } = require('../websocket/socket');
      const wss = getWss();
      if (wss) {
        wss.broadcast({ type: 'CLOCK_UPDATE', simulatedTime: simulatedTime.toISOString() });
      }

      const hour = simulatedTime.getHours();
      const prob = this.getHourMultiplier(hour);
      
      // Pass simulatedTime to service so DB records match the virtual clock
      if (Math.random() < prob) {
        await simulatorService.simulateCheckin(simulatedTime);
      }

      await simulatorService.simulateCheckout(simulatedTime);

      if (Math.random() < (prob * 0.1)) {
        await simulatorService.simulatePayment(simulatedTime);
      }

    } catch (err) {
      console.error('[Simulator] Error in tick:', err.message);
    }
  },

  getHourMultiplier(hour) {
    const morningPeak = gaussian(hour, 7.5, 1.2);
    const eveningPeak = gaussian(hour, 18.0, 1.8) * 0.95;
    const baseline = 0.05;
    const result = Math.max(morningPeak, eveningPeak, baseline);
    if (hour < 5 || hour > 23) return 0.01;
    return result;
  }
};

module.exports = simulator;
