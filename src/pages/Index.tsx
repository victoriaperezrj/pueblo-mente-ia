import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Zap, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen hero-gradient-bg flex flex-col text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg">Proyecto Emprendedurismo</span>
        </div>
        <Button variant="secondary" onClick={() => setShowLogin(true)}>
          Iniciar sesión
        </Button>
      </header>

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span>IA que entiende Argentina</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            De la idea a los números en días, no meses
          </h1>
          <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            La plataforma que combina IA + automatización + datos para que emprendedores y PyMEs validen ideas,
            organicen operaciones y escalen con confianza.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary" onClick={() => navigate("/select-role")}>
              Ver Demo
            </button>
            <button className="btn-secondary" onClick={() => setShowLogin(true)}>
              Iniciar Sesión →
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black/30 py-6 text-center text-sm">
        © 2025 Proyecto Emprendedurismo · Hecho con 💙 en Argentina.
      </footer>

      {/* MODAL */}
      {showLogin && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[90%] max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-white">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Entrá a tu cuenta</h2>
            <button
              onClick={() => (window.location.href = "/auth?provider=google")}
              className="btn-secondary w-full mb-3"
            >
              Continuar con Google
            </button>
            <button onClick={() => (window.location.href = "/auth?mode=login")} className="btn-secondary w-full">
              Continuar con Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
