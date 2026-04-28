const WebSocket = require('ws');

let wss;

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Welcome to WTF LivePulse' }));
    
    ws.on('close', () => console.log('Client disconnected'));
  });

  // Attach broadcast to wss
  wss.broadcast = function(data) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  return wss;
};

const getWss = () => wss;

module.exports = { initWebSocket, getWss };
