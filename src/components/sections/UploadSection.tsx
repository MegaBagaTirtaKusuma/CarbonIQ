"use client";
import { useState, useCallback } from "react";
import {
  CloudUpload, FileText, Search, Link2, Calculator,
  BarChart3, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { generatePDFReport } from "@/lib/generatePDF";
import { generateExcelReport } from "@/lib/generateExcel";
import { useRouter } from "next/navigation";

type UploadStatus = "idle" | "uploading" | "success" | "error";
type CalcStatus = "idle" | "calculating" | "done" | "error";

interface ActivityRow {
  nama_aktivitas: string;
  kuantitas: number;
  satuan: string;
  periode?: string;
}

interface EmissionResult extends ActivityRow {
  faktor_emisi: number;
  satuan_faktor: string;
  emisi_tco2e: number;
  scope: string;
  sumber_faktor: string;
}

const steps = [
  { icon: FileText, label: "Membaca\nfile" },
  { icon: Search, label: "Identifikasi\naktivitas" },
  { icon: Link2, label: "Mapping\nfaktor emisi" },
  { icon: Calculator, label: "Hitung\nemisi" },
  { icon: BarChart3, label: "Generate\nlaporan" },
];

const scopeColor: Record<string, string> = {
  "Scope 1": "bg-green-100 text-green-800",
  "Scope 2": "bg-blue-100 text-blue-800",
  "Scope 3": "bg-yellow-100 text-yellow-800",
};

export default function UploadSection() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [calcStatus, setCalcStatus] = useState<CalcStatus>("idle");
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [results, setResults] = useState<EmissionResult[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [perusahaan, setPerusahaan] = useState("Perusahaan Saya");
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());


  const handleFile = useCallback(async (file: File) => {
    setUploadStatus("uploading");
    setActivities([]);
    setResults([]);
    setCalcStatus("idle");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Terjadi kesalahan");
        setUploadStatus("error");
        return;
      }

      setActivities(data.activities);
      setUploadStatus("success");
    } catch {
      setErrorMsg("Gagal menghubungi server");
      setUploadStatus("error");
    }
  }, []);

  const handleCalculate = useCallback(async () => {
    setCalcStatus("calculating");
    setErrorMsg("");

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menghitung");
        setCalcStatus("error");
        return;
      }

      setResults(data.results);
      setCalcStatus("done");
      localStorage.setItem("carboniq_results", JSON.stringify(data.results));
    } catch {
      setErrorMsg("Gagal menghubungi server");
      setCalcStatus("error");
    }
  }, [activities]);

  const downloadExcel = useCallback(() => {
  generateExcelReport(results, perusahaan, tahun);
}, [results, perusahaan, tahun]);

  const totalEmisi = results.reduce((sum, r) => sum + r.emisi_tco2e, 0);
  const byScope = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.scope] = (acc[r.scope] || 0) + r.emisi_tco2e;
    return acc;
  }, {});

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);
  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <section id="upload" className="max-w-[1100px] mx-auto px-12 py-20">
      <p className="section-tag">AI Processing</p>
      <h2 className="section-title">Upload, AI Kerja Otomatis</h2>
      <p className="section-desc">
        Drag & drop file Excel atau PDF. AI langsung membaca, memetakan kolom, dan menghitung emisi karbon.
      </p>

      {/* Drop Zone */}
      <label
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`mt-10 rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all block ${
          dragging ? "border-[#0F6E56] bg-[#E1F5EE]" : "border-[#9FE1CB] bg-white hover:bg-[#E1F5EE] hover:border-[#0F6E56]"
        }`}
      >
        <input type="file" accept=".xlsx,.xls,.csv,.pdf" className="hidden" onChange={onFileInput} />
        <div className="w-14 h-14 bg-[#E1F5EE] rounded-2xl flex items-center justify-center mx-auto mb-4">
          {uploadStatus === "uploading"
            ? <Loader2 size={26} className="text-[#0F6E56] animate-spin" />
            : <CloudUpload size={26} className="text-[#0F6E56]" />
          }
        </div>
        <h3 className="text-[17px] font-semibold">
          {uploadStatus === "uploading" ? "Memproses file..." : "Drop Excel / PDF di sini"}
        </h3>
        <p className="text-sm text-gray-400 mt-2">atau klik untuk memilih file dari komputer Anda</p>
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          {[".xlsx", ".xls", ".csv", ".pdf"].map((f) => (
            <span key={f} className="text-xs bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB] px-3 py-1 rounded-full font-medium">{f}</span>
          ))}
        </div>
      </label>

      {/* Error */}
      {(uploadStatus === "error" || calcStatus === "error") && (
        <div className="mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-600">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {/* Tabel aktivitas setelah upload */}
      {uploadStatus === "success" && activities.length > 0 && calcStatus !== "done" && (
        <div className="mt-6 card">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={18} className="text-[#0F6E56]" />
            <span className="text-sm font-semibold text-[#0F6E56]">{activities.length} aktivitas berhasil dibaca</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Nama Aktivitas</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Kuantitas</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Satuan</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Periode</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "" : "bg-gray-50"}`}>
                    <td className="py-2 px-3">{row.nama_aktivitas}</td>
                    <td className="py-2 px-3">{row.kuantitas || "-"}</td>
                    <td className="py-2 px-3">{row.satuan}</td>
                    <td className="py-2 px-3 text-gray-400">{row.periode || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCalculate}
              disabled={calcStatus === "calculating"}
              className="btn-primary flex items-center gap-2"
            >
              {calcStatus === "calculating" && <Loader2 size={15} className="animate-spin" />}
              {calcStatus === "calculating" ? "AI sedang menghitung..." : "Proses dengan AI →"}
            </button>
            <button className="btn-outline" onClick={() => { setUploadStatus("idle"); setActivities([]); }}>
              Upload ulang
            </button>
          </div>
        </div>
      )}

      {/* Hasil kalkulasi AI */}
      {calcStatus === "done" && results.length > 0 && (
        <div className="mt-6 space-y-4">
          {/* Summary KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="card text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Total Emisi</div>
              <div className="text-2xl font-semibold text-[#0F6E56] mt-1">{totalEmisi.toFixed(2)}</div>
              <div className="text-xs text-gray-400">tCO₂e</div>
            </div>
            {Object.entries(byScope).map(([scope, val]) => (
              <div key={scope} className="card text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide">{scope}</div>
                <div className="text-2xl font-semibold mt-1">{val.toFixed(2)}</div>
                <div className="text-xs text-gray-400">tCO₂e</div>
              </div>
            ))}
          </div>

          {/* Tabel hasil */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-[#0F6E56]" />
              <span className="text-sm font-semibold text-[#0F6E56]">Hasil kalkulasi AI</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Aktivitas</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Qty</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Satuan</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Faktor</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Emisi (tCO₂e)</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Scope</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium uppercase tracking-wide">Sumber</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "" : "bg-gray-50"}`}>
                      <td className="py-2 px-3 font-medium">{row.nama_aktivitas}</td>
                      <td className="py-2 px-3">{row.kuantitas}</td>
                      <td className="py-2 px-3">{row.satuan}</td>
                      <td className="py-2 px-3 font-mono text-xs">{row.faktor_emisi} {row.satuan_faktor}</td>
                      <td className="py-2 px-3 font-semibold text-[#0F6E56]">{row.emisi_tco2e.toFixed(4)}</td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scopeColor[row.scope] || "bg-gray-100 text-gray-600"}`}>
                          {row.scope}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-gray-400">{row.sumber_faktor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Bagian Input dan Tombol yang Baru Ditambahkan */}
            <div className="mt-4 space-y-3">
              <div className="flex gap-3 flex-wrap">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Nama Perusahaan</label>
                  <input
                    type="text"
                    value={perusahaan}
                    onChange={(e) => setPerusahaan(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F6E56]"
                    placeholder="Nama Perusahaan"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tahun</label>
                  <input
                    type="text"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:border-[#0F6E56]"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  className="btn-primary"
                  onClick={() => generatePDFReport(results, perusahaan, tahun)}
                >
                  Download Laporan PDF
                </button>
                <button className="btn-outline" onClick={downloadExcel}>Download Excel</button>
                <button
                  className="btn-outline"
                  onClick={() => { setUploadStatus("idle"); setActivities([]); setResults([]); setCalcStatus("idle"); }}
                >
                  Analisis baru
                </button>
                <button
                className="btn-primary"
                onClick={() => router.push("/dashboard")}
                >  
                Lihat Dashboard →
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="flex items-start gap-0 mt-10 overflow-x-auto">
        {steps.map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex items-center flex-1 min-w-[90px]">
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-full bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center mx-auto mb-2">
                <Icon size={18} className="text-[#0F6E56]" />
              </div>
              <div className="text-xs text-[#4a5550] leading-snug whitespace-pre-line">{label}</div>
            </div>
            {i < steps.length - 1 && <div className="flex-none w-8 h-px bg-gray-200 mx-1 mt-[-18px]" />}
          </div>
        ))}
      </div>
    </section>
  );
}