import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Menu, X, Check, Zap, Target, TrendingUp,
  Briefcase, Shield, Users, BarChart3, Sparkles, Brain,
  Rocket, FileText, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-grok-overlay" onClick={onClose}>
      <div className="modal-grok-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-grok-bg" />
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors z-20">
          <X className="w-6 h-6" />
        </button>
        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Entrá a tu cuenta</h2>
          <p className="text-white/90 text-base">Empezá a usar IA para tu negocio en 2 minutos</p>
          <div className="space-y-3 mt-6">
            <button className="btn-login-grok" onClick={() => { onClose(); window.location.href = "/auth?mode=login&provider=google"; }}>
              <Zap className="w-5 h-5" /><span>Continuar con Google</span>
            </button>
            <button className="btn-login-grok" onClick={() => { onClose(); window.location.href = "/auth?mode=login"; }}>
              <FileText className="w-5 h-5" /><span>Continuar con Email</span>
            </button>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/30" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-transparent text-white/80">¿Primera vez acá?</span></div>
          </div>
          <button className="w-full text-center text-white hover:text-white/80 transition-colors font-semibold text-lg" onClick={() => { onClose(); window.location.href = "/auth?mode=signup"; }}>
            Crear cuenta gratis
          </button>
          <p className="text-center text-white/60 text-xs mt-8">Sin tarjeta. Sin trucos. Solo empezá.</p>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.3, rootMargin: "0px" });

    document.querySelectorAll(".scroll-fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sf">
      {/* HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-bold text-sm md:text-base text-gray-900 hidden xs:block">Proyecto Emprendedurismo</span>
            </div>
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <Button variant="ghost" onClick={() => setShowLoginModal(true)} className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors min-h-10">Iniciar Sesión</Button>
              <Button onClick={() => navigate("/auth?mode=signup")} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-md shadow-sm transition-all duration-200 button-hover min-h-10">Crear Cuenta</Button>
              <Button variant="outline" onClick={() => navigate("/select-role")} className="text-sm font-semibold border-gray-300 hover:bg-gray-50 transition-colors min-h-10">Ver Demo</Button>
            </div>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 pt-4">
              <Button variant="ghost" onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="w-full justify-center text-base font-semibold min-h-12">Iniciar Sesión</Button>
              <Button onClick={() => { navigate("/auth?mode=signup"); setMobileMenuOpen(false); }} className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-3 rounded-md min-h-12">Crear Cuenta</Button>
              <Button variant="outline" onClick={() => { navigate("/select-role"); setMobileMenuOpen(false); }} className="w-full justify-center text-base font-semibold min-h-12">Ver Demo</Button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="slide-left-decoration" />
        <div className="slide-right-decoration" />
        <div className="floating-particles-left" />
        <div className="floating-particles-right" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse" style={{ animationDuration: "8s" }} />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="badge-glow fade-in mb-8 inline-flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /><span>IA que entiende Argentina</span>
          </div>
          <h1 className="gradient-text-animated fade-in-up mb-6 text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            De la idea a los números en días, no meses
          </h1>
          <p className="text-white text-xl md:text-2xl mb-4 fade-in-up font-bold">
            La plataforma que combina <span className="text-yellow-300">IA + automatización + datos</span> para que emprendedores y PyMEs <span className="text-green-300">validen, organicen y escalen</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up">
            <button className="btn-secondary-glow group" onClick={() =>