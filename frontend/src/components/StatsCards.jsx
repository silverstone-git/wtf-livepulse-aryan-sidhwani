import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';

const StatsCards = () => {
  const { liveSnapshot, gyms, selectedGymId } = useStore();
  const selectedGym = gyms.find(g => g.id === selectedGymId);
  const capacity = selectedGym?.capacity || 100;
  const occupancyPct = Math.round((liveSnapshot.occupancy / capacity) * 100);
  
  const [lastPmt, setLastPmt] = useState(null);

  useEffect(() => {
    // Reverse events to find newest payment if newest is at bottom now
    const payment = [...liveSnapshot.recentEvents].reverse().find(e => e.type === 'PAYMENT');
    if (payment) {
      setLastPmt(payment);
    }
  }, [liveSnapshot.recentEvents]);

  return (
    <div className="flex flex-col gap-2">
      {/* Occupancy Card */}
      <div className="bg-surface-container grid-border p-5 relative overflow-hidden group" data-testid="occupancy-counter">
        <div className={`absolute left-0 top-0 bottom-0 w-[4px] transition-colors duration-500 ${occupancyPct > 90 ? 'bg-primary shadow-[0_0_15px_rgba(233,69,96,0.5)]' : 'bg-tertiary-container shadow-[0_0_15px_rgba(37,164,109,0.5)]'}`}></div>
        
        <div className="flex justify-between items-start mb-3">
          <h2 className="font-headline text-[11px] uppercase text-neutral-300 font-bold tracking-[0.15em]">Live Occupancy</h2>
          <span className={`w-2.5 h-2.5 rounded-full animate-subtle-pulse shadow-sm ${occupancyPct > 90 ? 'bg-primary' : 'bg-tertiary-container'}`}></span>
        </div>

        <div className="flex items-end space-x-6">
          <div className="font-kpi text-6xl font-bold text-white tracking-tighter drop-shadow-md">{liveSnapshot.occupancy}</div>
          <div className={`mb-1.5 font-kpi text-2xl font-black ${occupancyPct > 90 ? 'text-primary' : 'text-tertiary-container'}`}>
            {occupancyPct}%
          </div>
        </div>
        
        <div className="mt-3 flex items-center space-x-2">
           <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${occupancyPct > 90 ? 'bg-primary' : 'bg-tertiary-container'}`} 
                style={{ width: `${Math.min(100, occupancyPct)}%` }}
              ></div>
           </div>
           <div className="font-label text-[10px] text-neutral-500 uppercase font-bold whitespace-nowrap">Cap: {capacity}</div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-surface-container grid-border p-5 relative group" data-testid="revenue-ticker">
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-500/50 group-hover:bg-blue-500 transition-colors"></div>
        <h2 className="font-headline text-[11px] uppercase text-neutral-300 font-bold tracking-[0.15em] mb-3">Today's Revenue</h2>
        <div className="font-kpi text-5xl font-bold text-white tracking-tight">₹{liveSnapshot.todayRevenue?.toLocaleString('en-IN')}</div>
        
        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between font-label text-[10px]">
          <span className="uppercase text-neutral-500 font-black tracking-widest">Uplink Latest:</span>
          {lastPmt ? (
            <span className="text-white bg-blue-500/10 px-2 py-0.5 border border-blue-500/20 font-bold">
              ₹{lastPmt.amount} {lastPmt.plan_type} — {lastPmt.member_name.split(' ')[0]}
            </span>
          ) : (
            <span className="text-neutral-600 italic">No cycles recorded</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
