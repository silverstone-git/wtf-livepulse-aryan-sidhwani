import React from 'react';
import useStore from '../store/useStore';

const Heatmap = () => {
  const { analytics } = useStore();
  const { heatmap = [] } = analytics || {};

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const maxCheckins = Math.max(...(heatmap?.map(h => parseInt(h.checkin_count)) || []), 1);

  const getDayData = (dayIdx, hour) => {
    return heatmap?.find(h => h.day_of_week === dayIdx && h.hour_of_day === hour);
  };

  const getOpacity = (dayIdx, hour) => {
    const data = getDayData(dayIdx, hour);
    if (!data) return 0.05;
    return 0.1 + (parseInt(data.checkin_count) / maxCheckins) * 0.9;
  };

  return (
    <div className="bg-surface-container grid-border flex-1 flex flex-col min-h-[350px] overflow-hidden">
      <div className="p-4 grid-border-b bg-[#171728] flex justify-between items-center">
        <h2 className="font-headline text-[11px] uppercase text-neutral-300 font-bold tracking-[0.15em]">Footfall Heatmap (7D)</h2>
        <div className="flex items-center space-x-3">
          <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Intensity:</span>
          <div className="w-24 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5 flex">
            <div className="w-full h-full bg-gradient-to-r from-primary/10 via-primary/60 to-primary"></div>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex">
        {/* Y-Axis Time Labels */}
        <div className="flex flex-col justify-between text-[8px] text-neutral-500 font-label font-black pr-3 py-6 uppercase tracking-tighter">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>

        <div className="flex-1 grid grid-cols-7 gap-1.5">
          {days.map((dayName, dayIdx) => (
            <div key={dayIdx} className="flex flex-col gap-1 group relative">
              <div className="text-[9px] text-neutral-500 font-bold font-label text-center mb-1 group-hover:text-primary transition-colors">{dayName}</div>
              {Array.from({ length: 24 }).map((_, hour) => {
                const data = getDayData(dayIdx, hour);
                const count = data ? data.checkin_count : 0;
                return (
                  <div 
                    key={hour} 
                    className="flex-1 w-full bg-primary/90 transition-all duration-200 hover:scale-110 hover:z-20 hover:shadow-[0_0_15px_rgba(233,69,96,1)] border border-white/5 relative group/cell" 
                    style={{ opacity: getOpacity(dayIdx, hour) }}
                  >
                    {/* Tooltip Popup */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-black text-[9px] font-black rounded shadow-xl opacity-0 group-hover/cell:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {count} CHECK-INS
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
