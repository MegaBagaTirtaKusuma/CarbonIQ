import { Download, CheckCircle2 } from "lucide-react";

const features = [
  "Sheet terpisah untuk Scope 1, Scope 2, Scope 3",
  "Kolom wajib sudah ditandai warna hijau",
  "Contoh aktivitas & satuan sudah terisi",
  "Sheet referensi faktor emisi (IPCC, ESDM)",
  "AI otomatis isi kolom faktor & hasil setelah upload",
];

const previewRows = [
  { name: "Konsumsi Solar (kendaraan)", qty: "500", unit: "Liter" },
  { name: "Konsumsi Solar (genset)", qty: "200", unit: "Liter" },
  { name: "Konsumsi Bensin", qty: "150", unit: "Liter" },
];

export default function TemplateSection() {
  return (
    <section id="template" className="bg-[#E1F5EE] border-y border-[#9FE1CB]">
      <div className="max-w-[1100px] mx-auto px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <p className="section-tag">Template Excel</p>
          <h2 className="section-title">Download Template Resmi CarbonIQ</h2>
          <p className="text-[#4a5550] text-[15px] mt-3 leading-relaxed">
            Template Excel terstruktur sesuai GHG Protocol. Cukup isi kolom hijau,
            kolom faktor emisi & hasil dihitung otomatis oleh AI.
          </p>
          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-[#4a5550]">
                <CheckCircle2 size={18} className="text-[#0F6E56] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <a
            href="/CarbonIQ_Template_GHG.xlsx"
            download
            className="inline-flex items-center gap-3 bg-[#0F6E56] text-white px-7 py-3.5 rounded-xl text-[15px] font-medium mt-8 hover:bg-[#085041] hover:-translate-y-0.5 transition-all"
          >
            <Download size={18} />
            Download Template Excel
          </a>
        </div>

        {/* Right — preview card */}
        <div className="bg-white rounded-2xl border border-[#9FE1CB] overflow-hidden">
          <div className="bg-[#0F6E56] px-5 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-white">CarbonIQ_Template_GHG.xlsx</span>
            <span className="text-[10px] bg-[#1D9E75] text-white px-2.5 py-0.5 rounded-full">GHG Protocol</span>
          </div>
          <div className="flex border-b border-gray-200 text-xs">
            {["Scope 1", "Scope 2", "Scope 3", "Referensi"].map((tab, i) => (
              <div
                key={tab}
                className={`px-4 py-2 cursor-pointer ${i === 0 ? "text-[#0F6E56] border-b-2 border-[#0F6E56] font-medium" : "text-gray-400"}`}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="bg-[#0F6E56] text-white px-3 py-2 text-left font-medium">No.</th>
                  <th className="bg-[#0F6E56] text-white px-3 py-2 text-left font-medium">Nama Aktivitas *</th>
                  <th className="bg-[#0F6E56] text-white px-3 py-2 text-left font-medium">Kuantitas *</th>
                  <th className="bg-[#0F6E56] text-white px-3 py-2 text-left font-medium">Satuan *</th>
                  <th className="bg-gray-100 text-gray-400 px-3 py-2 text-left font-medium">Faktor (AI)</th>
                  <th className="bg-gray-100 text-gray-400 px-3 py-2 text-left font-medium">Emisi (AI)</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map(({ name, qty, unit }, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="bg-[#F0FBF6] px-3 py-2">{i + 1}</td>
                    <td className="bg-[#F0FBF6] px-3 py-2">{name}</td>
                    <td className="bg-[#F0FBF6] px-3 py-2">{qty}</td>
                    <td className="bg-[#F0FBF6] px-3 py-2">{unit}</td>
                    <td className="bg-gray-50 px-3 py-2 text-gray-400 italic">(AI)</td>
                    <td className="bg-gray-50 px-3 py-2 text-gray-400 italic">(AI)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 text-[11px] text-gray-400 border-t border-gray-100">
            ✦ Kolom hijau = isi sendiri &nbsp;|&nbsp; Kolom abu = diisi AI otomatis
          </div>
        </div>
      </div>
    </section>
  );
}
