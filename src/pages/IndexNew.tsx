import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";
import { HeroSection } from "@/components/landing/HeroSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { StagesSection } from "@/components/landing/StagesSection";
import { MethodSection } from "@/components/landing/MethodSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

export default function IndexNew() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate('/demo/select-role');
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar onAuthClick={() => setShowAuthModal(true)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      <HeroSection onDemoClick={handleDemoClick} onStartClick={handleGetStarted} />
      <BenefitsSection />
      <StagesSection onStageSelect={handleGetStarted} />
      <MethodSection />
      <TestimonialsSection />
      <CTASection onGetStarted={handleGetStarted} />
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Proyecto Emprendedurismo. Hecho con 💙 en Argentina.
          </p>
        </div>
      </footer>
    </div>
  );
}
