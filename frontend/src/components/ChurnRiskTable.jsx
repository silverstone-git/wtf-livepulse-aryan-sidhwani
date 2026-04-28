import React from 'react';
import useStore from '../store/useStore';

const ChurnRiskTable = () => {
  const { analytics } = useStore();
  const { churnRisk = [] } = analytics || {};

  const getDaysAgo = (dateStr) => {
    if (!dateStr) return 'N/A';
    const diff = new Date() - new Date(dateStr);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-surface-container grid-border flex-1 flex flex-col min-h-[250px] overflow-hidden">
      <div className="p-3 grid-border-b bg-[#171728] shadow-sm">
        <h2 className="font-headline text-[11px] uppercase text-neutral-300 font-black tracking-[0.15em]">Retention Risk Matrix</h2>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#12121F] font-label text-[9px] text-neutral-500 uppercase grid-border-b sticky top-0 z-10">
            <tr>
              <th className="p-3 grid-border-r font-black tracking-widest">Inert Asset</th>
              <th className="p-3 grid-border-r font-black tracking-widest text-center">Last Uplink</th>
              <th className="p-3 font-black tracking-widest text-right">Threat Level</th>
            </tr>
          </thead>
          <tbody className="font-body text-xs">
            {churnRisk.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-10 text-center text-neutral-600 font-label text-[10px] uppercase tracking-[0.4em] italic opacity-50">
                  Scanning for churn risk...
                </td>
              </tr>
            ) : (
              churnRisk.map((member, idx) => (
                <tr key={member.id} className={`grid-border-b transition-colors hover:bg-white/[0.02] ${idx % 2 === 0 ? 'bg-[#0D0D1A]' : 'bg-[#12121F]'}`}>
                  <td className="p-3 grid-border-r text-neutral-200 font-bold tracking-tight">{member.name}</td>
                  <td className="p-3 grid-border-r font-kpi text-[10px] text-neutral-400 text-center font-bold">
                    {getDaysAgo(member.last_checkin_at)}D AGO
                  </td>
                  <td className="p-3 text-right">
                    <span className={`font-label text-[8px] px-2 py-0.5 font-black border ${
                      member.risk_level === 'CRITICAL' 
                        ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(233,69,96,0.2)]' 
                        : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
                    }`}>
                      {member.risk_level}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChurnRiskTable;
