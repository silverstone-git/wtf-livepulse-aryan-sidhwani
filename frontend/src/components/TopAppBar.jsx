import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';

const TopAppBar = () => {
  const { gyms, selectedGymId, setSelectedGymId, unreadAnomalyCount, simulatedTime, settings, toggleSetting } = useStore();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  
  const profileRef = useRef(null);
  const settingsRef = useRef(null);
  const navRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const totalRevenue = gyms.reduce((acc, g) => acc + (g.today_revenue || 0), 0);

  const formatSimTime = (iso) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return 'OFFLINE';
      return d.toLocaleString('en-IN', { 
        day: '2-digit', month: 'short', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', 
        hour12: false 
      });
    } catch (e) {
      return 'OFFLINE';
    }
  };

  const checkScroll = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [gyms]);

  useEffect(() => {
    if (selectedGymId && navRef.current) {
      const activeTab = navRef.current.querySelector(`[data-gym-id="${selectedGymId}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
    setTimeout(checkScroll, 500);
  }, [selectedGymId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setShowSettings(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = async () => {
    if (!confirm('CAUTION: This will wipe all live sessions and anomalies. Proceed?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/simulator/reset`, { method: 'POST' });
      window.location.reload();
    } catch (err) {
      console.error('Reset failure:', err);
    }
  };

  const handleTerminate = () => {
    if (confirm('TERMINATE OPERATOR SESSION? All telemetry will be suspended for this client.')) {
      setIsTerminated(true);
    }
  };

  const scrollToEnd = (direction) => {
    if (navRef.current) {
      navRef.current.scrollTo({
        left: direction === 'left' ? 0 : navRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  };

  if (isTerminated) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-kpi space-y-6">
        <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-4xl text-primary">lock</span>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-white text-3xl font-black tracking-widest uppercase">Terminal Locked</h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.3em]">Operator Session Terminated</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 border border-white/10 text-white hover:bg-white hover:text-black transition-all font-black uppercase text-xs tracking-widest"
        >
          Re-Initialize System
        </button>
      </div>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-black border-b border-white/5 shadow-2xl">
      {/* Brand & Clock */}
      <div className="flex items-center space-x-6 flex-shrink-0">
        <div className="flex flex-col leading-none">
          <span className="font-headline text-xl font-black tracking-[0.25em] text-primary drop-shadow-[0_0_10px_rgba(233,69,96,0.3)] uppercase">WTF LIVEPULSE</span>
          <span className="font-kpi text-[9px] text-tertiary font-bold tracking-[0.2em] mt-1 uppercase opacity-80">{formatSimTime(simulatedTime)}</span>
        </div>
        <div className="h-8 w-[1px] bg-white/10 hidden lg:block"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative flex-1 h-full mx-4 overflow-hidden group">
        {canScrollLeft && (
          <button 
            onClick={() => scrollToEnd('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-neutral-600 hover:text-white transition-colors animate-[bob-left_1.5s_infinite_ease-in-out] cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_left</span>
          </button>
        )}

        <nav 
          ref={navRef}
          onScroll={checkScroll}
          className="flex space-x-1 h-full items-center overflow-x-auto no-scrollbar snap-x scroll-px-4"
        >
          {gyms.map((gym) => (
            <button
              key={gym.id}
              data-gym-id={gym.id}
              onClick={() => setSelectedGymId(gym.id)}
              className={`h-full px-5 flex items-center transition-all duration-200 cursor-pointer border-b-2 snap-center flex-shrink-0 ${
                selectedGymId === gym.id
                  ? 'text-white border-primary bg-primary/10 font-black'
                  : 'text-neutral-500 border-transparent hover:text-neutral-300 hover:bg-white/5 font-bold'
              }`}
            >
              <span className="font-headline text-[10px] uppercase tracking-[0.15em] whitespace-nowrap">
                {gym.name.replace('WTF Gyms — ', '')}
              </span>
            </button>
          ))}
        </nav>

        {canScrollRight && (
          <button 
            onClick={() => scrollToEnd('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-neutral-600 hover:text-white transition-colors animate-[bob-right_1.5s_infinite_ease-in-out] cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_right</span>
          </button>
        )}
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center space-x-6 flex-shrink-0">
        <div className="hidden xl:flex flex-col items-end leading-none">
          <span className="font-label text-[10px] text-neutral-500 uppercase font-black mb-1">Fleet Revenue</span>
          <span className="font-kpi text-sm text-white font-bold tracking-tighter">₹{(totalRevenue / 1000).toFixed(1)}K Today</span>
        </div>

        <div className="flex items-center space-x-3">
          <button className="relative w-9 h-9 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors group cursor-pointer">
            <span className={`material-symbols-outlined text-[20px] transition-colors ${unreadAnomalyCount > 0 ? 'text-primary' : 'text-neutral-400 group-hover:text-white'}`} style={{ fontVariationSettings: "'FILL' 0" }}>
              {unreadAnomalyCount > 0 ? 'notifications_active' : 'notifications'}
            </span>
            {unreadAnomalyCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full leading-none z-10 animate-subtle-pulse shadow-lg">
                {unreadAnomalyCount}
              </span>
            )}
          </button>

          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${showSettings ? 'bg-primary text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
            </button>
            
            {showSettings && (
              <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-white/10 shadow-2xl z-50 overflow-hidden rounded-sm">
                <div className="p-3 border-b border-white/5 bg-black/50 font-label text-[9px] uppercase font-black text-neutral-500 tracking-widest">System Configuration</div>
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => toggleSetting('audibleAlerts')}
                    className="w-full text-left px-3 py-2 text-[11px] text-neutral-300 hover:bg-white/5 flex justify-between items-center transition-colors cursor-pointer"
                  >
                    <span>Audible Alerts</span>
                    <div className={`w-6 h-3 rounded-full relative transition-colors ${settings.audibleAlerts ? 'bg-primary/50' : 'bg-neutral-700'}`}>
                      <div className={`absolute top-0.5 w-2 h-2 rounded-full transition-all ${settings.audibleAlerts ? 'bg-primary right-0.5' : 'bg-neutral-400 left-0.5'}`}></div>
                    </div>
                  </button>
                  <button 
                    onClick={() => toggleSetting('highContrast')}
                    className="w-full text-left px-3 py-2 text-[11px] text-neutral-300 hover:bg-white/5 flex justify-between items-center transition-colors cursor-pointer"
                  >
                    <span>High Contrast</span>
                    <div className={`w-6 h-3 rounded-full relative transition-colors ${settings.highContrast ? 'bg-primary/50' : 'bg-neutral-700'}`}>
                      <div className={`absolute top-0.5 w-2 h-2 rounded-full transition-all ${settings.highContrast ? 'bg-primary right-0.5' : 'bg-neutral-400 left-0.5'}`}></div>
                    </div>
                  </button>
                  <div className="h-[1px] bg-white/5 my-1"></div>
                  <button 
                    onClick={handleReset}
                    className="w-full text-left px-3 py-2 text-[11px] text-primary hover:bg-primary/10 font-bold uppercase tracking-tighter cursor-pointer"
                  >
                    Wipe Database Cache
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <div 
              data-testid="profile-button"
              onClick={() => setShowProfile(!showProfile)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all shadow-inner ${showProfile ? 'border-primary bg-primary/20' : 'border-white/10 bg-gradient-to-br from-neutral-700 to-neutral-900 hover:border-primary/50'}`}
            >
              <span className={`material-symbols-outlined text-lg ${showProfile ? 'text-white' : 'text-neutral-300'}`}>person</span>
            </div>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-white/10 shadow-2xl z-50 overflow-hidden rounded-sm">
                <div className="p-4 bg-black/50 border-b border-white/5 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded bg-primary flex items-center justify-center font-headline font-black text-white">OP</div>
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-tight">Operator Admin</div>
                    <div className="text-[9px] text-tertiary font-bold uppercase tracking-widest">Senior Operations Lead</div>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-neutral-500 font-bold uppercase">System Status</span>
                    <span className="text-tertiary font-bold animate-pulse">ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-neutral-500 font-bold uppercase">Access Level</span>
                    <span className="text-white font-bold px-1 bg-neutral-800 border border-white/5 rounded-sm text-[8px]">ROOT_EXEC</span>
                  </div>
                  <button 
                    onClick={handleTerminate}
                    className="w-full mt-2 py-2 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    Terminate Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
