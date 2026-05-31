import { NextRequest, NextResponse } from "next/server";
import { calculateEmissions, ActivityRow } from "@/lib/calculateEmissions";

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries reached");
}

export async function POST(req: NextRequest) {
  try {
    const { activities }: { activities: ActivityRow[] } = await req.json();

    if (!activities || activities.length === 0) {
      return NextResponse.json({ error: "Tidak ada aktivitas" }, { status: 400 });
    }

    const results = await withRetry(() => calculateEmissions(activities));
    return NextResponse.json({ results });

  } catch (err) {
    console.error("Calculate error:", err);
    return NextResponse.json({ error: "Gagal menghitung emisi, coba lagi" }, { status: 500 });
  }
}