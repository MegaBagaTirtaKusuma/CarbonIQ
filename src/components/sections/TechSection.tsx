const techStacks = [
  {
    title: "Frontend",
    items: ["Next.js 15", "TypeScript", "TailwindCSS", "Recharts"],
  },
  {
    title: "Backend",
    items: ["Next.js API Routes", "PostgreSQL", "Supabase"],
  },
  {
    title: "AI & OCR",
    items: ["OpenAI API", "pdf-parse", "Tesseract OCR", "SheetJS"],
  },
  {
    title: "Export & Report",
    items: ["PDF ESG Report", "Excel Download", "Multi-perusahaan", "Multi-tahun"],
  },
];

export default function TechSection() {
  return (
    <section id="teknologi" className="max-w-[1100px] mx-auto px-12 py-20">
      <p className="section-tag">Stack Teknologi</p>
      <h2 className="section-title">Dibangun dengan teknologi modern</h2>
      <p className="section-desc">
        Full-stack production-grade dengan AI, OCR, dan visualisasi data profesional.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
        {techStacks.map(({ title, items }) => (
          <div key={title} className="card text-center">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">{title}</div>
            <div className="space-y-1.5">
              {items.map((item) => (
                <div key={item} className="text-sm text-[#4a5550]">{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
