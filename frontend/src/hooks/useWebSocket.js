import { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore';

const useWebSocket = (url) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  
  const addEvent = useStore((state) => state.addEvent);
  const updateOccupancy = useStore((state) => state.updateOccupancy);
  const updateRevenue = useStore((state) => state.updateRevenue);
  const addAnomaly = useStore((state) => state.addAnomaly);
  const resolveAnomaly = useStore((state) => state.resolveAnomaly);
  const dismissAnomaly = useStore((state) => state.dismissAnomaly);
  const setSimulatedTime = useStore((state) => state.setSimulatedTime);
  const audibleAlerts = useStore((state) => state.settings.audibleAlerts);

  const playAlert = () => {
    if (!audibleAlerts) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio feedback failed');
    }
  };

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'CLOCK_UPDATE':
            setSimulatedTime(data.simulatedTime);
            break;

          case 'CHECKIN_EVENT':
          case 'CHECKOUT_EVENT':
            if (data.simulatedTime) setSimulatedTime(data.simulatedTime);
            updateOccupancy(data.gym_id, data.current_occupancy);
            addEvent({
              type: data.type === 'CHECKIN_EVENT' ? 'CHECKIN' : 'CHECKOUT',
              member_name: data.member_name,
              timestamp: data.timestamp,
              gym_id: data.gym_id
            });
            break;
            
          case 'PAYMENT_EVENT':
            if (data.simulatedTime) setSimulatedTime(data.simulatedTime);
            updateRevenue(data.gym_id, data.today_total);
            addEvent({
              type: 'PAYMENT',
              member_name: data.member_name,
              amount: data.amount,
              plan_type: data.plan_type,
              timestamp: data.timestamp || new Date().toISOString(),
              gym_id: data.gym_id
            });
            break;

          case 'ANOMALY_DETECTED':
            playAlert();
            addAnomaly(data);
            break;

          case 'ANOMALY_RESOLVED':
            resolveAnomaly(data.id);
            break;

          case 'ANOMALY_DISMISSED':
            dismissAnomaly(data.id);
            break;

          default:
            break;
        }
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected. Reconnecting...');
        setConnected(false);
        setTimeout(connect, 3000);
      };

      socketRef.current = ws;
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, addEvent, updateOccupancy, updateRevenue, addAnomaly, resolveAnomaly, dismissAnomaly, setSimulatedTime, audibleAlerts]);

  return connected;
};

export default useWebSocket;
