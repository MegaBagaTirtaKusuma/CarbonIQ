import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface EmissionResult {
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

export function generateExcelReport(
  results: EmissionResult[],
  perusahaan: string = "Perusahaan",
  tahun: string = new Date().getFullYear().toString()
) {
  const wb = XLSX.utils.book_new();

  // ── SHEET 1: RINGKASAN ───────────────────────────────────────
  const totalEmisi = results.reduce((s, r) => s + r.emisi_tco2e, 0);
  const byScope = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.scope] = (acc[r.scope] || 0) + r.emisi_tco2e;
    return acc;
  }, {});

  const summaryData = [
    ["CarbonIQ — Laporan Emisi GHG"],
    [""],
    ["Perusahaan", perusahaan],
    ["Tahun Pelaporan", tahun],
    ["Tanggal Dibuat", new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })],
    ["Metodologi", "GHG Protocol Corporate Standard"],
    [""],
    ["RINGKASAN EMISI"],
    ["Total Emisi (tCO₂e)", totalEmisi.toFixed(4)],
    ["Scope 1 (tCO₂e)", (byScope["Scope 1"] || 0).toFixed(4)],
    ["Scope 2 (tCO₂e)", (byScope["Scope 2"] || 0).toFixed(4)],
    ["Scope 3 (tCO₂e)", (byScope["Scope 3"] || 0).toFixed(4)],
    ["Jumlah Aktivitas", results.length],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary["!cols"] = [{ wch: 30 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");

  // ── SHEET 2: DETAIL AKTIVITAS ────────────────────────────────
  const detailHeaders = [
    "No.",
    "Nama Aktivitas",
    "Kuantitas",
    "Satuan",
    "Periode",
    "Faktor Emisi",
    "Satuan Faktor",
    "Emisi (tCO₂e)",
    "Scope",
    "Sumber Faktor",
  ];

  const detailRows = results.map((r, i) => [
    i + 1,
    r.nama_aktivitas,
    r.kuantitas,
    r.satuan,
    r.periode || "-",
    r.faktor_emisi,
    r.satuan_faktor,
    parseFloat(r.emisi_tco2e.toFixed(6)),
    r.scope,
    r.sumber_faktor,
  ]);

  const wsDetail = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailRows]);
  wsDetail["!cols"] = [
    { wch: 5 },
    { wch: 30 },
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
    { wch: 14 },
    { wch: 20 },
    { wch: 16 },
    { wch: 12 },
    { wch: 24 },
  ];
  XLSX.utils.book_append_sheet(wb, wsDetail, "Detail Aktivitas");

  // ── SHEET 3: PER SCOPE ───────────────────────────────────────
  for (const scope of ["Scope 1", "Scope 2", "Scope 3"]) {
    const filtered = results.filter((r) => r.scope === scope);
    if (filtered.length === 0) continue;

    const rows = filtered.map((r, i) => [
      i + 1,
      r.nama_aktivitas,
      r.kuantitas,
      r.satuan,
      r.faktor_emisi,
      r.satuan_faktor,
      parseFloat(r.emisi_tco2e.toFixed(6)),
      r.sumber_faktor,
    ]);

    const total = filtered.reduce((s, r) => s + r.emisi_tco2e, 0);
    rows.push(["", "TOTAL", "", "", "", "", parseFloat(total.toFixed(6)), ""] as never);

    const ws = XLSX.utils.aoa_to_sheet([
      ["No.", "Nama Aktivitas", "Kuantitas", "Satuan", "Faktor Emisi", "Satuan Faktor", "Emisi (tCO₂e)", "Sumber"],
      ...rows,
    ]);
    ws["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 20 }, { wch: 16 }, { wch: 24 }];
    XLSX.utils.book_append_sheet(wb, ws, scope);
  }

  // ── SAVE ─────────────────────────────────────────────────────
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `CarbonIQ_Laporan_${perusahaan}_${tahun}.xlsx`);
}