import { create } from 'zustand';

const useStore = create((set, get) => ({
  // --- Gym Slice ---
  gyms: [],
  selectedGymId: null,
  liveSnapshot: {
    occupancy: 0,
    todayRevenue: 0,
    recentEvents: [],
    activeAnomalies: []
  },
  analytics: {
    heatmap: [],
    revenueByPlan: [],
    churnRisk: [],
    newVsRenewal: []
  },
  
  setGyms: (gyms) => set({ gyms }),
  setSelectedGymId: (id) => set({ selectedGymId: id }),
  setLiveSnapshot: (snapshot) => set({ liveSnapshot: snapshot }),
  setAnalytics: (analytics) => set({ analytics }),
  
  addEvent: (event) => set((state) => ({
    liveSnapshot: {
      ...state.liveSnapshot,
      recentEvents: [...state.liveSnapshot.recentEvents, event].slice(-20)
    }
  })),

  updateOccupancy: (gymId, occupancy) => {
    const { selectedGymId } = get();
    if (gymId === selectedGymId) {
      set((state) => ({
        liveSnapshot: { ...state.liveSnapshot, occupancy }
      }));
    }
    // Also update in gyms list
    set((state) => ({
      gyms: state.gyms.map(g => g.id === gymId ? { ...g, current_occupancy: occupancy } : g)
    }));
  },

  updateRevenue: (gymId, todayTotal) => {
    const { selectedGymId } = get();
    if (gymId === selectedGymId) {
      set((state) => ({
        liveSnapshot: { ...state.liveSnapshot, todayRevenue: todayTotal }
      }));
    }
    set((state) => ({
      gyms: state.gyms.map(g => g.id === gymId ? { ...g, today_revenue: todayTotal } : g)
    }));
  },

  // --- Anomaly Slice ---
  anomalies: [],
  unreadAnomalyCount: 0,
  
  setAnomalies: (anomalies) => set({ anomalies, unreadAnomalyCount: anomalies.length }),
  
  addAnomaly: (anomaly) => set((state) => ({
    anomalies: [anomaly, ...state.anomalies],
    unreadAnomalyCount: state.unreadAnomalyCount + 1
  })),
  
  resolveAnomaly: (id) => set((state) => ({
    anomalies: state.anomalies.map(a => 
      a.id === id ? { ...a, resolved: true, resolved_at: new Date().toISOString() } : a
    ),
    unreadAnomalyCount: Math.max(0, state.unreadAnomalyCount - 1)
  })),

  dismissAnomaly: (id) => set((state) => ({
    anomalies: state.anomalies.map(a => 
      a.id === id ? { ...a, dismissed: true } : a
    ),
    unreadAnomalyCount: Math.max(0, state.unreadAnomalyCount - 1)
  })),

  // --- Simulator Slice ---
  simulatorStatus: {
    isRunning: false,
    speed: 1
  },
  simulatedTime: new Date().toISOString(),
  setSimulatorStatus: (status) => set({ simulatorStatus: status }),
  setSimulatedTime: (time) => set({ simulatedTime: time }),

  // --- Settings Slice ---
  settings: {
    audibleAlerts: true,
    highContrast: false,
  },
  toggleSetting: (key) => set((state) => ({
    settings: { ...state.settings, [key]: !state.settings[key] }
  })),
}));

export default useStore;
