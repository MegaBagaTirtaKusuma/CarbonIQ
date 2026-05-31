"use client";

const bars = [
  { label: "Solar", pct: 85, color: "#0F6E56", val: "62.4 t" },
  { label: "Listrik PLN", pct: 56, color: "#1D9E75", val: "35.1 t" },
  { label: "Transportasi", pct: 38, color: "#5DCAA5", val: "20.6 t" },
];

const kpis = [
  { label: "Total Emisi", val: "125.4", sub: "tCO₂e", green: true },
  { label: "Scope 1", val: "55.3", sub: "tCO₂e · Langsung" },
  { label: "Scope 2", val: "35.1", sub: "tCO₂e · Listrik" },
  { label: "Scope 3", val: "35.0", sub: "tCO₂e · Tidak langsung" },
];

export default function DashboardPreview() {
  return (
    <div className="bg-[#F8FAF9] rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#4a5550]">Dashboard Emisi Karbon</span>
        <span className="flex items-center gap-1.5 text-xs text-[#1D9E75]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {kpis.map(({ label, val, sub, green }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="text-[11px] uppercase tracking-wide text-gray-400">{label}</div>
            <div className={`text-[22px] font-semibold mt-0.5 ${green ? "text-[#0F6E56]" : "text-[#1a1f1d]"}`}>{val}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        {bars.map(({ label, pct, color, val }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="text-[11px] text-[#4a5550] w-[75px] text-right flex-shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-[11px] text-gray-400 w-14 flex-shrink-0">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
