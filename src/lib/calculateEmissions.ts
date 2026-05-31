import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ActivityRow {
  nama_aktivitas: string;
  kuantitas: number;
  satuan: string;
  periode?: string;
}

export interface EmissionResult extends ActivityRow {
  faktor_emisi: number;
  satuan_faktor: string;
  emisi_tco2e: number;
  scope: "Scope 1" | "Scope 2" | "Scope 3";
  sumber_faktor: string;
}

export async function calculateEmissions(activities: ActivityRow[]): Promise<EmissionResult[]> {
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Kamu adalah ahli GHG Protocol dan carbon accounting.
Untuk setiap aktivitas berikut, tentukan:
1. scope (Scope 1 / Scope 2 / Scope 3)
2. faktor_emisi (angka desimal)
3. satuan_faktor (contoh: kgCO2e/Liter)
4. emisi_tco2e (kuantitas × faktor_emisi / 1000, dalam tCO2e)
5. sumber_faktor (IPCC 2006 / Kemen ESDM 2023 / GHG Protocol)

Faktor emisi standar Indonesia:
- Solar/diesel: 2.68 kgCO2e/Liter
- Bensin: 2.31 kgCO2e/Liter
- LPG: 2.98 kgCO2e/kg
- Listrik PLN Jawa-Bali: 0.87 kgCO2e/kWh
- Listrik PLN Sumatera: 0.79 kgCO2e/kWh
- Transportasi darat: 0.062 kgCO2e/ton-km
- Transportasi laut: 0.011 kgCO2e/ton-km
- Penerbangan domestik: 0.255 kgCO2e/km
- Limbah padat TPA: 0.52 tCO2e/Ton

Data aktivitas:
${JSON.stringify(activities, null, 2)}

Balas HANYA dengan JSON array, tanpa teks lain, tanpa markdown. Format:
[
  {
    "nama_aktivitas": "...",
    "kuantitas": 0,
    "satuan": "...",
    "periode": "...",
    "faktor_emisi": 0.0,
    "satuan_faktor": "...",
    "emisi_tco2e": 0.0,
    "scope": "Scope 1",
    "sumber_faktor": "..."
  }
]
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  }
}