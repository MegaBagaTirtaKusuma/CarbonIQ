"use client";
import Link from "next/link";

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-[60px] bg-white/95 backdrop-blur-md border-b border-gray-200">
      <span className="text-xl font-semibold text-[#0F6E56] tracking-tight">
        Carbon<span className="text-gray-400 font-light">IQ</span>
      </span>
      <div className="hidden md:flex gap-8">
        {(["#scope","#template","#upload","#analitik","#teknologi"] as const).map((href, i) => (
          <Link key={href} href={href} className="text-sm text-[#4a5550] hover:text-[#0F6E56] transition-colors">
            {["Fitur","Template","Upload","Analitik","Teknologi"][i]}
          </Link>
        ))}
        <Link href="/dashboard" className="text-sm text-[#0F6E56] font-medium hover:underline transition-colors">
          Dashboard
        </Link>
      </div>
      <div className="flex gap-3">
        <button className="btn-primary" onClick={() => scrollTo("upload")}>Mulai Analisis</button>
      </div>    
    </nav>
  );
}