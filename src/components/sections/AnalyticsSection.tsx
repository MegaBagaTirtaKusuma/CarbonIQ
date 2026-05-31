"use client";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";

const pieData = [
  { name: "Scope 1", value: 55.3, color: "#0F6E56" },
  { name: "Scope 2", value: 35.1, color: "#1D9E75" },
  { name: "Scope 3", value: 35.0, color: "#5DCAA5" },
];

const lineData = [
  { month: "Jan", val: 18 }, { month: "Feb", val: 22 },
  { month: "Mar", val: 19 }, { month: "Apr", val: 25 },
  { month: "Mei", val: 21 }, { month: "Jun", val: 20 },
];

const barData = [
  { label: "Solar", pct: 85, color: "#0F6E56", val: "62.4 t" },
  { label: "Listrik PLN", pct: 56, color: "#1D9E75", val: "35.1 t" },
  { label: "Transportasi", pct: 38, color: "#5DCAA5", val: "20.6 t" },
  { label: "Limbah", pct: 22, color: "#9FE1CB", val: "7.3 t" },
];

export default function AnalyticsSection() {
  return (
    <section id="analitik" className="max-w-[1100px] mx-auto px-12 py-20">
      <p className="section-tag">Visualisasi</p>
      <h2 className="section-title">Analitik & Visualisasi Data</h2>
      <p className="section-desc">
        Grafik profesional level ESG report — pie chart, bar chart, tren bulanan, waterfall, dan Sankey diagram.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {/* Bar chart */}
        <div className="card">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-5">Emisi per aktivitas</div>
          <div className="space-y-3">
            {barData.map(({ label, pct, color, val }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-[#4a5550] w-[85px] text-right flex-shrink-0">{label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="text-xs text-gray-400 w-14 flex-shrink-0">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="card">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-5">Emisi per scope</div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={pieData} cx={50} cy={50} innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                  {pieData.map(({ color }, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v.toFixed(1)} tCO₂e`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {pieData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2 text-sm text-[#4a5550]">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
                  {name} — {((value / 125.4) * 100).toFixed(0)}%
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line chart */}
        <div className="card md:col-span-2">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-5">Tren emisi bulanan (tCO₂e)</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v} tCO₂e`]} />
              <Line type="monotone" dataKey="val" stroke="#0F6E56" strokeWidth={2} dot={{ r: 3, fill: "#0F6E56" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight box */}
      <div className="mt-6 bg-white rounded-2xl border border-[#9FE1CB] border-l-4 border-l-[#0F6E56] p-6">
        <div className="text-[11px] uppercase tracking-[1px] text-[#0F6E56] font-semibold mb-2">✦ AI Insight</div>
        <p className="text-sm text-[#4a5550] leading-relaxed">
          Aktivitas solar menyumbang 62% total emisi. Pengurangan konsumsi solar sebesar 20% dapat mengurangi emisi sebesar{" "}
          <strong className="text-[#1a1f1d]">16.8 ton CO₂e per tahun</strong> — setara dengan menanam 840 pohon dewasa.
        </p>
        <button className="btn-outline text-sm mt-4">Lihat rekomendasi lengkap →</button>
      </div>
    </section>
  );
}
