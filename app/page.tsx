import VideoScrollHero from "./components/VideoScrollHero";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import WhySection from "./components/WhySection";
import BenefitsSection from "./components/BenefitsSection";
import ProcessSection from "./components/ProcessSection";
import ContactSection from "./components/ContactSection";
import Navigation from "./components/Navigation";

export default function Home() {
  return (
    <main className="w-full md:min-w-[1400px] max-w-[1920px] mx-auto relative">
      <VideoScrollHero />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <WhySection />
      <BenefitsSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
