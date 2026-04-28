import React from 'react';
import useStore from '../store/useStore';

const AnomalyLog = () => {
  const { anomalies = [], dismissAnomaly } = useStore();
  const activeAnomalies = (anomalies || []).filter(a => a && !a.dismissed && (!a.resolved || (new Date() - new Date(a.resolved_at) < 86400000)));

  const handleDismiss = async (id, severity) => {
    if (severity === 'critical') {
      alert('Manual override rejected: Critical anomalies require system resolution.');
      return;
    }
    if (!confirm('Execute manual dismissal for this warning?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/anomalies/${id}/dismiss`, {
        method: 'PATCH'
      });
      if (res.ok) {
        dismissAnomaly(id);
      }
    } catch (err) {
      console.error('Dismissal failure:', err);
    }
  };

  return (
    <div className="bg-surface-container grid-border overflow-hidden">
      <div className="p-3 grid-border-b bg-[#171728] flex justify-between items-center shadow-sm">
        <h2 className="font-headline text-[11px] uppercase text-primary font-black tracking-[0.2em]">Uplink Anomalies</h2>
        <span className="font-label text-[9px] bg-primary/20 text-primary px-2 py-0.5 border border-primary/50 font-bold">
          {activeAnomalies.length} ALERTS ACTIVE
        </span>
      </div>
      <div className="flex flex-col max-h-[280px] overflow-y-auto divide-y divide-white/5">
        {activeAnomalies.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center opacity-40">
            <span className="material-symbols-outlined text-3xl mb-2 text-tertiary">check_circle</span>
            <div className="text-neutral-400 font-label text-[10px] uppercase tracking-[0.3em]">All Systems Nominal</div>
          </div>
        ) : (
          activeAnomalies.map((a) => (
            <div key={a.id} className={`p-4 flex justify-between items-center transition-colors ${a.resolved ? 'bg-black/20 opacity-60' : (a.severity === 'critical' ? 'bg-primary/5 hover:bg-primary/10' : 'bg-yellow-500/5 hover:bg-yellow-500/10')}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${a.severity === 'critical' ? 'border-primary/50 bg-primary/10 text-primary' : 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500'}`}>
                   <span className="material-symbols-outlined text-lg">
                    {a.severity === 'critical' ? 'warning' : 'error'}
                  </span>
                </div>
                <div>
                  <div className="font-headline text-[11px] text-white uppercase font-black tracking-tight leading-none mb-1">
                    {a.type.replace('_', ' ')} {a.resolved && <span className="text-tertiary">(RESOLVED)</span>}
                  </div>
                  <div className="font-label text-[9px] text-neutral-500 font-bold uppercase">
                    {new Date(a.detected_at).toLocaleTimeString()} — {a.gym_name.replace('WTF Gyms — ', '')}
                  </div>
                </div>
              </div>
              {!a.resolved && a.severity !== 'critical' && (
                <button 
                  onClick={() => handleDismiss(a.id, a.severity)}
                  className="font-label text-[9px] text-neutral-300 border border-neutral-700 px-3 py-1.5 hover:bg-white hover:text-black transition-all font-black uppercase tracking-tighter"
                >
                  Dismiss
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnomalyLog;
