import React from 'react';
import useStore from '../store/useStore';

const SimulatorControls = () => {
  const { simulatorStatus, setSimulatorStatus } = useStore();
  const { isRunning, speed } = simulatorStatus;

  const handleToggle = async () => {
    const endpoint = isRunning ? 'stop' : 'start';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/simulator/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulatorStatus({ isRunning: endpoint === 'start', speed: data.speed || speed });
      }
    } catch (err) {
      console.error('Simulator error:', err);
    }
  };

  const updateSpeed = async (nextSpeed) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/simulator/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed: nextSpeed })
      });
      if (res.ok) {
        setSimulatorStatus({ isRunning: true, speed: nextSpeed });
      }
    } catch (err) {
      console.error('Simulator speed error:', err);
    }
  };

  const handleStep = (direction) => {
    const speeds = [1, 5, 10, 100, 200];
    const currentIndex = speeds.indexOf(speed);
    let nextIndex;
    
    if (direction === 'up') {
      nextIndex = (currentIndex + 1) % speeds.length;
    } else {
      nextIndex = (currentIndex - 1 + speeds.length) % speeds.length;
    }
    
    updateSpeed(speeds[nextIndex]);
  };

  const handleReset = async () => {
    if (!confirm('CAUTION: Clear all live check-ins and reset anomalies?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/simulator/reset`, { method: 'POST' });
      window.location.reload();
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  return (
    <div className="bg-surface-container grid-border p-4 relative group">
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-tertiary shadow-[0_0_10px_rgba(103,220,159,0.3)]"></div>
      
      <div className="flex justify-between items-center mb-4 pl-1">
        <h2 className="font-headline text-[10px] uppercase text-neutral-400 font-black tracking-[0.2em]">Simulation Engine</h2>
        <div className="flex items-center space-x-3">
           <button onClick={handleReset} className="font-label text-[9px] text-neutral-600 hover:text-primary transition-colors uppercase font-black tracking-tighter decoration-dotted underline underline-offset-4 cursor-pointer">Reset</button>
           <span className={`font-label text-[9px] px-2 py-0.5 border font-black tracking-widest ${isRunning ? 'border-tertiary text-tertiary bg-tertiary/10 animate-pulse' : 'border-neutral-700 text-neutral-500'}`}>
            {isRunning ? 'RUNNING' : 'STANDBY'}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={handleToggle}
          className={`flex-1 font-headline text-xs py-2.5 transition-all border border-transparent font-black tracking-widest uppercase cursor-pointer ${isRunning ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700' : 'bg-primary text-white hover:bg-primary/80 shadow-[0_0_15px_rgba(233,69,96,0.3)] active:scale-95'}`}
        >
          {isRunning ? 'Interrupt Signal' : 'Initiate Simulation'}
        </button>
        
        <div className="flex items-stretch border border-white/5 bg-white/5 rounded-sm overflow-hidden">
          <button 
            onClick={() => handleStep('down')}
            className="px-2 text-neutral-500 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center cursor-pointer border-r border-white/5"
            title="Step Down Velocity"
          >
            <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>fast_rewind</span>
          </button>
          
          <div 
            data-testid="speed-display"
            className="px-3 flex flex-col items-center justify-center min-w-[50px] bg-black/20"
          >
            <span className="font-kpi text-[11px] font-black text-white leading-none">{speed}X</span>
            <span className="text-[6px] font-label text-neutral-500 uppercase font-black mt-0.5">VEL</span>
          </div>

          <button 
            onClick={() => handleStep('up')}
            className="px-2 text-neutral-500 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center cursor-pointer border-l border-white/5"
            title="Step Up Velocity"
          >
            <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>fast_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulatorControls;
