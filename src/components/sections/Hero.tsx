"use client";
import DashboardPreview from "@/components/dashboard/DashboardPreview";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-[1100px] mx-auto px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#E1F5EE] border border-[#9FE1CB] px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
            <span className="text-xs text-[#085041] font-medium">GHG Protocol Compliant</span>
          </div>
          <h1 className="text-[42px] font-semibold leading-[1.15] tracking-[-1.5px]">
            Hitung Emisi Karbon<br />
            Perusahaan dengan{" "}
            <em className="not-italic text-[#0F6E56]">AI</em>
          </h1>
          <p className="text-[#4a5550] text-base mt-4 max-w-[420px] leading-relaxed">
            Upload Excel atau PDF, biarkan AI menganalisis data dan menghitung
            emisi karbon berdasarkan standar GHG Protocol secara otomatis.
          </p>
          <div className="flex gap-3 mt-8 flex-wrap">
          <button
            className="btn-primary text-[15px] px-6 py-3 rounded-xl font-medium hover:-translate-y-0.5 transition-transform"
            onClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })}
          >
            Mulai Analisis →
          </button>
        </div>
          <div className="flex gap-10 mt-10 pt-8 border-t border-gray-200">
            {[
              { val: "98%", lbl: "Akurasi AI" },
              { val: "3 Scope", lbl: "GHG Protocol" },
              { val: "<60s", lbl: "Waktu proses" },
            ].map(({ val, lbl }) => (
              <div key={lbl}>
                <div className="text-[22px] font-semibold text-[#0F6E56]">{val}</div>
                <div className="text-xs text-gray-400 mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <DashboardPreview />
      </div>
    </section>
  );
}
