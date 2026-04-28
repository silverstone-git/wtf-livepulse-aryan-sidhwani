import React, { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore';

const ActivityFeed = () => {
  const { liveSnapshot } = useStore();
  const { recentEvents } = liveSnapshot;
  const scrollRef = useRef(null);
  const [showFab, setShowFab] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const getEventColor = (type) => {
    switch (type) {
      case 'CHECKIN': return 'bg-tertiary-container';
      case 'CHECKOUT': return 'bg-neutral-500';
      case 'PAYMENT': return 'bg-blue-500';
      default: return 'bg-neutral-500';
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour12: false });
  };

  // Auto-scroll to bottom when new events arrive if isAutoScrolling is true
  useEffect(() => {
    if (isAutoScrolling && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [recentEvents, isAutoScrolling]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // If not near bottom, show FAB and stop auto-scrolling
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShowFab(!isAtBottom);
    setIsAutoScrolling(isAtBottom);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsAutoScrolling(true);
    }
  };

  return (
    <div className="bg-surface-container grid-border flex flex-col h-full overflow-hidden relative">
      <div className="p-3 grid-border-b bg-[#171728] flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h2 className="font-headline text-xs uppercase text-white font-bold tracking-widest">Live Activity Feed</h2>
        <div className="flex items-center space-x-1 text-tertiary-container">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-subtle-pulse"></span>
          <span className="font-label text-[9px] font-bold">LIVE</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-2.5 scroll-smooth"
      >
        {recentEvents.length === 0 ? (
          <div className="text-center py-10 text-neutral-600 font-label text-xs uppercase tracking-tighter">Waiting for uplink...</div>
        ) : (
          recentEvents.map((event, idx) => (
            <div key={idx} className="bg-[#0D0D1A] border border-white/5 p-2 flex items-start space-x-3 transform transition-all hover:border-white/10 hover:bg-white/5">
              <div className={`w-1 h-full min-h-[36px] ${getEventColor(event.type)} self-stretch shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={`font-headline text-[10px] font-black tracking-tighter ${event.type === 'CHECKIN' ? 'text-tertiary' : 'text-white'}`}>{event.type}</span>
                  <span className="font-kpi text-neutral-400 text-[10px] font-bold">{formatTime(event.timestamp)}</span>
                </div>
                <div className="font-body text-neutral-200 text-[11px] leading-tight opacity-90">
                  {event.type === 'PAYMENT' 
                    ? <><span className="text-blue-400 font-bold">₹{event.amount}</span> cleared - {event.member_name}</>
                    : <><span className="text-white font-medium">{event.member_name}</span> {event.type === 'CHECKIN' ? 'entered' : 'left'} facility.</>
                  }
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Scroll to Bottom FAB */}
      {showFab && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20 border border-white/20 animate-bounce"
        >
          <span className="material-symbols-outlined text-sm">arrow_downward</span>
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
