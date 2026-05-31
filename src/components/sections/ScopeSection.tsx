const scopes = [
  {
    num: "Scope 1",
    title: "Emisi Langsung",
    items: ["Kendaraan operasional", "Pembakaran solar & bensin", "Generator genset", "Refrigeran (kebocoran AC)"],
  },
  {
    num: "Scope 2",
    title: "Energi Tidak Langsung",
    items: ["Listrik PLN", "Uap dari pihak ketiga", "Energi panas/dingin", "Market-based method"],
  },
  {
    num: "Scope 3",
    title: "Rantai Nilai",
    items: ["Transportasi & logistik", "Perjalanan bisnis", "Emisi supplier", "Pengelolaan limbah"],
  },
];

export default function ScopeSection() {
  return (
    <section id="scope" className="max-w-[1100px] mx-auto px-12 py-20">
      <p className="section-tag">Cakupan Emisi</p>
      <h2 className="section-title">Tiga Scope GHG Protocol</h2>
      <p className="section-desc">
        Menghitung semua sumber emisi sesuai standar internasional yang digunakan perusahaan Fortune 500.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {scopes.map(({ num, title, items }) => (
          <div key={num} className="card hover:border-[#9FE1CB] transition-colors">
            <div className="text-[11px] font-semibold text-[#0F6E56] uppercase tracking-[1.5px] mb-2">{num}</div>
            <h3 className="text-[17px] font-semibold">{title}</h3>
            <ul className="mt-4 space-y-1.5">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#4a5550]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
