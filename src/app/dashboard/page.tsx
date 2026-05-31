"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  AreaChart, Area,
} from "recharts";

interface EmissionResult {
  nama_aktivitas: string;
  kuantitas: number;
  satuan: string;
  periode?: string;
  faktor_emisi: number;
  satuan_faktor: string;
  emisi_tco2e: number;
  scope: string;
  sumber_faktor: string;
}

// Data dummy untuk demo — nanti diganti data real dari upload
const dummyResults: EmissionResult[] = [
  { nama_aktivitas: "Konsumsi Solar (kendaraan)", kuantitas: 5000, satuan: "Liter", faktor_emisi: 2.68, satuan_faktor: "kgCO2e/Liter", emisi_tco2e: 13.4, scope: "Scope 1", sumber_faktor: "IPCC 2006", periode: "Jan-Des 2024" },
  { nama_aktivitas: "Konsumsi Solar (genset)", kuantitas: 2000, satuan: "Liter", faktor_emisi: 2.68, satuan_faktor: "kgCO2e/Liter", emisi_tco2e: 5.36, scope: "Scope 1", sumber_faktor: "IPCC 2006", periode: "Jan-Des 2024" },
  { nama_aktivitas: "Konsumsi Bensin", kuantitas: 1500, satuan: "Liter", faktor_emisi: 2.31, satuan_faktor: "kgCO2e/Liter", emisi_tco2e: 3.465, scope: "Scope 1", sumber_faktor: "IPCC 2006", periode: "Jan-Des 2024" },
  { nama_aktivitas: "Konsumsi LPG", kuantitas: 500, satuan: "kg", faktor_emisi: 2.98, satuan_faktor: "kgCO2e/kg", emisi_tco2e: 1.49, scope: "Scope 1", sumber_faktor: "IPCC 2006", periode: "Jan-Des 2024" },
  { nama_aktivitas: "Konsumsi Listrik PLN", kuantitas: 50000, satuan: "kWh", faktor_emisi: 0.87, satuan_faktor: "kgCO2e/kWh", emisi_tco2e: 43.5, scope: "Scope 2", sumber_faktor: "Kemen ESDM 2023", periode: "Jan-Des 2024" },
  { nama_aktivitas: "Transportasi barang (darat)", kuantitas: 100000, satuan: "ton-km", faktor_emisi: 0.062, satuan_faktor: "kgCO2e/ton-km", emisi_tco2e: 6.2, scope: "Scope 3", sumber_faktor: "GHG Protocol", periode: "Jan-Des 2024" },
  { nama_aktivitas: "Perjalanan bisnis (pesawat)", kuantitas: 20000, satuan: "km", faktor_emisi: 0.255, satuan_faktor: "kgCO2e/km", emisi_tco2e: 5.1, scope: "Scope 3", sumber_faktor: "ICAO", periode: "Jan-Des 2024" },
  { nama_aktivitas: "Pengolahan limbah padat", kuantitas: 50, satuan: "Ton", faktor_emisi: 520, satuan_faktor: "kgCO2e/Ton", emisi_tco2e: 26.0, scope: "Scope 3", sumber_faktor: "IPCC 2006", periode: "Jan-Des 2024" },
];

const COLORS = ["#0F6E56", "#1D9E75", "#5DCAA5", "#9FE1CB", "#34D399", "#6EE7B7"];
const SCOPE_COLORS: Record<string, string> = {
  "Scope 1": "#0F6E56",
  "Scope 2": "#3B82F6",
  "Scope 3": "#F59E0B",
};

const monthlyData = [
  { month: "Jan", emisi: 8.2 },
  { month: "Feb", emisi: 9.1 },
  { month: "Mar", emisi: 7.8 },
  { month: "Apr", emisi: 10.4 },
  { month: "Mei", emisi: 9.6 },
  { month: "Jun", emisi: 8.9 },
  { month: "Jul", emisi: 11.2 },
  { month: "Agu", emisi: 10.8 },
  { month: "Sep", emisi: 9.3 },
  { month: "Okt", emisi: 10.1 },
  { month: "Nov", emisi: 9.7 },
  { month: "Des", emisi: 11.5 },
];

export default function DashboardPage() {
  const [results, setResults] = useState<EmissionResult[]>(dummyResults);

useEffect(() => {
  const saved = localStorage.getItem("carboniq_results");
    if (saved) {
        try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
            setResults(parsed);
        }
        } catch {
        // fallback ke dummy data
        }
    }
    }, []);

  const totalEmisi = results.reduce((s, r) => s + r.emisi_tco2e, 0);
  const byScope = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.scope] = (acc[r.scope] || 0) + r.emisi_tco2e;
    return acc;
  }, {});

  const pieData = Object.entries(byScope).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));

  const barData = [...results]
    .sort((a, b) => b.emisi_tco2e - a.emisi_tco2e)
    .slice(0, 8)
    .map((r) => ({
      name: r.nama_aktivitas.length > 20 ? r.nama_aktivitas.substring(0, 20) + "..." : r.nama_aktivitas,
      emisi: parseFloat(r.emisi_tco2e.toFixed(3)),
      scope: r.scope,
    }));

  const topActivity = [...results].sort((a, b) => b.emisi_tco2e - a.emisi_tco2e)[0];
  const pct = totalEmisi > 0 ? ((topActivity?.emisi_tco2e || 0) / totalEmisi * 100).toFixed(0) : "0";

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-[60px] bg-white border-b border-gray-200">
        <Link href="/" className="text-xl font-semibold text-[#0F6E56] tracking-tight">
          Carbon<span className="text-gray-400 font-light">IQ</span>
        </Link>
        <div className="flex items-center gap-2 text-sm text-[#0F6E56] bg-[#E1F5EE] px-3 py-1.5 rounded-full border border-[#9FE1CB]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
          Dashboard Emisi
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-[#0F6E56] transition-colors">
          ← Kembali
        </Link>
      </nav>

      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard Emisi GHG</h1>
          <p className="text-sm text-gray-400 mt-1">Tahun 2024 · GHG Protocol Compliant · Data Demo</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Emisi", val: totalEmisi.toFixed(2), sub: "tCO2e", green: true },
            { label: "Scope 1", val: (byScope["Scope 1"] || 0).toFixed(2), sub: "tCO2e · Langsung" },
            { label: "Scope 2", val: (byScope["Scope 2"] || 0).toFixed(2), sub: "tCO2e · Listrik" },
            { label: "Scope 3", val: (byScope["Scope 3"] || 0).toFixed(2), sub: "tCO2e · Tidak Langsung" },
          ].map(({ label, val, sub, green }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
              <div className={`text-3xl font-semibold mt-1 ${green ? "text-[#0F6E56]" : "text-[#1a1f1d]"}`}>{val}</div>
              <div className="text-xs text-gray-400 mt-1">{sub}</div>
            </div>
          ))}
        </div>

        {/* Row 1: Pie + Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Distribusi per Scope</div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={Object.values(SCOPE_COLORS)[i] || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v.toFixed(2) + " tCO2e"]} />
                <Legend
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Top Aktivitas */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Top Aktivitas Emisi (tCO2e)</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={120} />
                <Tooltip formatter={(v: number) => [v.toFixed(3) + " tCO2e"]} />
                <Bar dataKey="emisi" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={SCOPE_COLORS[entry.scope] || "#0F6E56"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Area Chart tren bulanan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Tren Emisi Bulanan (tCO2e) — 2024</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorEmisi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F6E56" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0F6E56" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [v.toFixed(1) + " tCO2e", "Emisi"]} />
              <Area type="monotone" dataKey="emisi" stroke="#0F6E56" strokeWidth={2} fill="url(#colorEmisi)" dot={{ r: 3, fill: "#0F6E56" }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Row 3: Insight + Tabel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* AI Insight */}
          <div className="bg-white rounded-2xl border border-[#9FE1CB] border-l-4 border-l-[#0F6E56] p-6">
            <div className="text-xs font-semibold text-[#0F6E56] uppercase tracking-wide mb-3">AI Insight</div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Aktivitas <strong className="text-[#1a1f1d]">{topActivity?.nama_aktivitas}</strong> menyumbang{" "}
              <strong className="text-[#0F6E56]">{pct}%</strong> dari total emisi.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              Pengurangan 20% dapat menghemat{" "}
              <strong className="text-[#0F6E56]">{((topActivity?.emisi_tco2e || 0) * 0.2).toFixed(2)} tCO2e</strong> per tahun.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-400">Benchmark Industri</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F6E56] rounded-full" style={{ width: `${Math.min((totalEmisi / 150) * 100, 100)}%` }} />
                </div>
                <span className="text-xs text-gray-400">{totalEmisi.toFixed(0)} / 150 t</span>
              </div>
            </div>
          </div>

          {/* Scope breakdown */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Detail per Scope</div>
            <div className="space-y-4">
              {Object.entries(byScope).map(([scope, val]) => {
                const pctScope = ((val / totalEmisi) * 100).toFixed(1);
                return (
                  <div key={scope}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{scope}</span>
                      <span className="text-gray-400">{val.toFixed(2)} tCO2e · {pctScope}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pctScope}%`, background: SCOPE_COLORS[scope] || "#0F6E56" }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {results.filter((r) => r.scope === scope).length} aktivitas
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabel semua aktivitas */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Semua Aktivitas</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {["Nama Aktivitas", "Kuantitas", "Satuan", "Faktor Emisi", "Emisi (tCO2e)", "Scope", "Sumber"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "" : "bg-gray-50"}`}>
                    <td className="py-2 px-3 font-medium">{row.nama_aktivitas}</td>
                    <td className="py-2 px-3">{row.kuantitas.toLocaleString("id-ID")}</td>
                    <td className="py-2 px-3">{row.satuan}</td>
                    <td className="py-2 px-3 font-mono text-xs">{row.faktor_emisi} {row.satuan_faktor}</td>
                    <td className="py-2 px-3 font-semibold text-[#0F6E56]">{row.emisi_tco2e.toFixed(4)}</td>
                    <td className="py-2 px-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: SCOPE_COLORS[row.scope] + "20", color: SCOPE_COLORS[row.scope] }}>
                        {row.scope}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-gray-400">{row.sumber_faktor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}