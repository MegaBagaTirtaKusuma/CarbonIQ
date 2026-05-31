import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

export function generatePDFReport(
  results: EmissionResult[],
  perusahaan: string = "Perusahaan",
  tahun: string = new Date().getFullYear().toString()
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const totalEmisi = results.reduce((s, r) => s + r.emisi_tco2e, 0);
  const byScope = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.scope] = (acc[r.scope] || 0) + r.emisi_tco2e;
    return acc;
  }, {});

  const GREEN: [number, number, number] = [15, 110, 86];
  const GREEN_LIGHT: [number, number, number] = [225, 245, 238];
  const WHITE: [number, number, number] = [255, 255, 255];
  const DARK: [number, number, number] = [26, 31, 29];
  const GRAY: [number, number, number] = [74, 85, 80];
  const GRAY_BG: [number, number, number] = [248, 250, 249];

  // ── COVER PAGE ────────────────────────────────────────────────
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, 210, 52, "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("CarbonIQ", 20, 26);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Greenhouse Gas Calculator", 20, 36);

  doc.setFontSize(9);
  doc.text("GHG Protocol Compliant  |  Scope 1 / Scope 2 / Scope 3", 20, 44);

  // Report title
  doc.setTextColor(...DARK);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Emisi GHG", 20, 70);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text("Perusahaan  : " + perusahaan, 20, 82);
  doc.text("Tahun       : " + tahun, 20, 90);
  doc.text("Tanggal     : " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }), 20, 98);
  doc.text("Metodologi  : GHG Protocol Corporate Standard", 20, 106);

  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.5);
  doc.line(20, 114, 190, 114);

  // ── KPI BOXES ─────────────────────────────────────────────────
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Ringkasan Emisi", 20, 126);

  const kpis = [
    { label: "TOTAL EMISI", val: totalEmisi.toFixed(2) + " tCO2e", x: 20 },
    { label: "SCOPE 1", val: (byScope["Scope 1"] || 0).toFixed(2) + " tCO2e", x: 80 },
    { label: "SCOPE 2", val: (byScope["Scope 2"] || 0).toFixed(2) + " tCO2e", x: 140 },
  ];

  kpis.forEach(({ label, val, x }) => {
    doc.setFillColor(...GREEN_LIGHT);
    doc.roundedRect(x, 130, 55, 22, 3, 3, "F");
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, 130, 55, 22, 3, 3, "S");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GRAY);
    doc.text(label, x + 4, 137);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN);
    doc.text(val, x + 4, 147);
  });

  // Scope 3 box
  doc.setFillColor(...GREEN_LIGHT);
  doc.roundedRect(20, 157, 55, 22, 3, 3, "F");
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, 157, 55, 22, 3, 3, "S");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GRAY);
  doc.text("SCOPE 3", 24, 164);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN);
  doc.text((byScope["Scope 3"] || 0).toFixed(2) + " tCO2e", 24, 174);

  // Info tambahan
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text("Jumlah aktivitas: " + results.length, 82, 164);

  const topActivity = [...results].sort((a, b) => b.emisi_tco2e - a.emisi_tco2e)[0];
  if (topActivity) {
    doc.text("Emisi terbesar:", 82, 171);
    const namaLines = doc.splitTextToSize(topActivity.nama_aktivitas, 100);
    doc.text(namaLines, 82, 178);
  }

  // ── AI INSIGHT BOX ────────────────────────────────────────────
  doc.setFillColor(...GRAY_BG);
  doc.roundedRect(20, 190, 170, 32, 3, 3, "F");
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, 190, 170, 32, 3, 3, "S");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN);
  doc.text("AI Insight", 25, 198);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);

  const pct = totalEmisi > 0
    ? ((topActivity?.emisi_tco2e || 0) / totalEmisi * 100).toFixed(0)
    : "0";
  const insightText = topActivity
    ? "Aktivitas \"" + topActivity.nama_aktivitas + "\" menyumbang " + pct + "% dari total emisi (" + topActivity.emisi_tco2e.toFixed(2) + " tCO2e). Pengurangan 20% pada aktivitas ini dapat mengurangi emisi sebesar " + (topActivity.emisi_tco2e * 0.2).toFixed(2) + " tCO2e per tahun."
    : "Tidak ada data aktivitas yang cukup untuk menghasilkan insight.";

  const lines = doc.splitTextToSize(insightText, 158);
  doc.text(lines, 25, 206);

  // ── PAGE 2: TABEL DETAIL ──────────────────────────────────────
  doc.addPage();

  doc.setFillColor(...GREEN);
  doc.rect(0, 0, 210, 18, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CarbonIQ  |  Detail Kalkulasi Emisi", 20, 12);

  doc.setTextColor(...DARK);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Detail Aktivitas & Kalkulasi Emisi", 20, 32);

  autoTable(doc, {
    startY: 38,
    head: [["Nama Aktivitas", "Qty", "Satuan", "Faktor Emisi", "Emisi (tCO2e)", "Scope", "Sumber"]],
    body: results.map((r) => [
      r.nama_aktivitas,
      r.kuantitas.toLocaleString("id-ID"),
      r.satuan,
      r.faktor_emisi + " " + r.satuan_faktor,
      r.emisi_tco2e.toFixed(4),
      r.scope,
      r.sumber_faktor,
    ]),
    headStyles: {
      fillColor: GREEN,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: DARK },
    alternateRowStyles: { fillColor: GREEN_LIGHT },
    columnStyles: {
      0: { cellWidth: 48 },
      1: { cellWidth: 14, halign: "right" },
      2: { cellWidth: 16 },
      3: { cellWidth: 36 },
      4: { cellWidth: 24, halign: "right" },
      5: { cellWidth: 22 },
      6: { cellWidth: 28 },
    },
    margin: { left: 10, right: 10 },
  });

  // ── FOOTER ────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...GREEN);
    doc.rect(0, 285, 210, 12, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("CarbonIQ  |  GHG Protocol Compliant  |  Laporan dibuat otomatis", 20, 292);
    doc.text("Hal. " + i + " / " + pageCount, 185, 292, { align: "right" });
  }

  doc.save("CarbonIQ_Laporan_" + perusahaan + "_" + tahun + ".pdf");
}