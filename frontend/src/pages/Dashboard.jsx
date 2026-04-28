import React, { useEffect } from 'react';
import useStore from '../store/useStore';
import useWebSocket from '../hooks/useWebSocket';
import TopAppBar from '../components/TopAppBar';
import StatsCards from '../components/StatsCards';
import Heatmap from '../components/Heatmap';
import AnomalyLog from '../components/AnomalyLog';
import ChurnRiskTable from '../components/ChurnRiskTable';
import SimulatorControls from '../components/SimulatorControls';
import ActivityFeed from '../components/ActivityFeed';

const Dashboard = () => {
  const { 
    setGyms, 
    setSelectedGymId, 
    selectedGymId, 
    setLiveSnapshot, 
    setAnalytics, 
    setAnomalies,
    setSimulatorStatus
  } = useStore();
  
  const API_URL = import.meta.env.VITE_API_URL;
  const WS_URL = import.meta.env.VITE_WS_URL;

  useWebSocket(WS_URL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gymsRes = await fetch(`${API_URL}/api/gyms`);
        const gymsData = await gymsRes.json();
        setGyms(gymsData);
        if (gymsData.length > 0 && !selectedGymId) {
          setSelectedGymId(gymsData[0].id);
        }

        const anomaliesRes = await fetch(`${API_URL}/api/anomalies`);
        const anomaliesData = await anomaliesRes.json();
        setAnomalies(anomaliesData);

        const simRes = await fetch(`${API_URL}/api/simulator/status`);
        const simData = await simRes.json();
        setSimulatorStatus(simData);
      } catch (err) {
        console.error('Initial fetch failed:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedGymId) return;

    const fetchGymData = async () => {
      try {
        const liveRes = await fetch(`${API_URL}/api/gyms/${selectedGymId}/live`);
        const liveData = await liveRes.json();
        setLiveSnapshot(liveData);

        const analyticsRes = await fetch(`${API_URL}/api/analytics/${selectedGymId}`);
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Gym data fetch failed:', err);
      }
    };

    fetchGymData();
    const interval = setInterval(fetchGymData, 30000); // Polling as fallback for non-WS data
    return () => clearInterval(interval);
  }, [selectedGymId]);

  return (
    <div className="flex flex-col h-screen">
      <TopAppBar />
      
      <main className="flex-1 mt-12 grid grid-cols-[1fr_1fr_320px] gap-2 p-2 overflow-hidden">
        {/* Column 1: Core Metrics & Heatmap */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <StatsCards />
          <Heatmap />
        </div>

        {/* Column 2: Logs & Churn */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <AnomalyLog />
          <ChurnRiskTable />
          <SimulatorControls />
        </div>

        {/* Column 3: Activity Feed */}
        <div className="h-full overflow-hidden">
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
