import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import ScopeSection from "@/components/sections/ScopeSection";
import TemplateSection from "@/components/sections/TemplateSection";
import UploadSection from "@/components/sections/UploadSection";
import AnalyticsSection from "@/components/sections/AnalyticsSection";
import TechSection from "@/components/sections/TechSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <div className="h-px bg-gray-200" />
      <ScopeSection />
      <TemplateSection />
      <div className="h-px bg-gray-200" />
      <UploadSection />
      <div className="h-px bg-gray-200" />
      <AnalyticsSection />
      <div className="h-px bg-gray-200" />
      <TechSection />
      <CTASection />
      <Footer />
    </main>
  );
}
