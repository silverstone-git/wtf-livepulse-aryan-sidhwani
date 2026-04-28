const express = require('express');
const http = require('http');
const cors = require('cors');
const { execSync } = require('child_process');
require('dotenv').config();

const { initWebSocket } = require('./websocket/socket');
const gymRoutes = require('./routes/gymRoutes');
const memberRoutes = require('./routes/memberRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const anomalyRoutes = require('./routes/anomalyRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');

const anomalyDetector = require('./jobs/anomalyDetector');
const simulator = require('./jobs/simulator');

const app = express();
const server = http.createServer(app);

// Initialize WebSockets
initWebSocket(server);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/gyms', gymRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/simulator', simulatorRoutes);

const PORT = process.env.PORT || 3001;

// Run seed script before starting
try {
  console.log('Checking database and seeding if necessary...');
  execSync('node src/db/seeds/seed.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to run seed script:', error.message);
  process.exit(1);
}

// Start background jobs
setInterval(() => anomalyDetector.run(), process.env.ANOMALY_INTERVAL || 30000);

// Start Server
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
