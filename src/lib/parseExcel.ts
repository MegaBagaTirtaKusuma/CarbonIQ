import * as XLSX from "xlsx";

export interface ActivityRow {
  nama_aktivitas: string;
  kuantitas: number;
  satuan: string;
  periode?: string;
  deskripsi?: string;
}

export function parseExcelBuffer(buffer: Buffer): ActivityRow[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const results: ActivityRow[] = [];

  for (const sheetName of workbook.SheetNames) {
    if (!sheetName.toLowerCase().includes("scope")) continue;

    const sheet = workbook.Sheets[sheetName];

    // Header ada di row 6 (index 5), skip 5 baris pertama
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      range: 5, // mulai dari row index 5 = Row 6 di Excel
    });

    for (const row of rows) {
      const nama = String(row["Nama Aktivitas *"] || "").trim();
      const qty = parseFloat(String(row["Jumlah / Kuantitas *"] || "0"));
      const satuan = String(row["Satuan *"] || "").trim();

      // Skip baris kosong, header, atau placeholder AI
      if (!nama) continue;
      if (nama.toLowerCase().includes("nama aktivitas")) continue;
      if (satuan === "(diisi AI)" || nama === "(dihitung AI)") continue;

      results.push({
        nama_aktivitas: nama,
        kuantitas: isNaN(qty) ? 0 : qty,
        satuan,
        periode: String(row["Periode (Bulan/Tahun)"] || ""),
        deskripsi: String(row["Deskripsi / Keterangan"] || ""),
      });
    }
  }

  return results;
}