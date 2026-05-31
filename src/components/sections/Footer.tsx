import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-12 py-6 flex items-center justify-between flex-wrap gap-4">
      <span className="text-xl font-semibold text-[#0F6E56] tracking-tight">
        Carbon<span className="text-gray-400 font-light">IQ</span>
      </span>
      <p className="text-sm text-gray-400">© 2025 CarbonIQ. GHG Protocol Compliant.</p>
      <div className="flex gap-6">
        {["Tentang GHG", "Metodologi", "Kontak"].map((link) => (
          <Link key={link} href="#" className="text-sm text-gray-400 hover:text-[#0F6E56] transition-colors">
            {link}
          </Link>
        ))}
        <a href="/CarbonIQ_Template_GHG.xlsx" download className="text-sm text-[#0F6E56] font-medium hover:underline">
          Download Template
        </a>
      </div>
    </footer>
  );
}
