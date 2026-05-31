import { NextRequest, NextResponse } from "next/server";
import { parseExcelBuffer } from "@/lib/parseExcel";
import { parsePDFBuffer } from "@/lib/parsePDF";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();

    // Excel / CSV
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv")) {
      const activities = parseExcelBuffer(buffer);

      if (activities.length === 0) {
        return NextResponse.json({ error: "Tidak ada data aktivitas yang terbaca. Pastikan menggunakan template CarbonIQ." }, { status: 422 });
      }

      return NextResponse.json({ type: "excel", activities });
    }

    // PDF
    if (fileName.endsWith(".pdf")) {
      const text = await parsePDFBuffer(buffer);
      return NextResponse.json({ type: "pdf", raw_text: text });
    }

    return NextResponse.json({ error: "Format file tidak didukung" }, { status: 415 });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Gagal memproses file" }, { status: 500 });
  }
}