import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Rocket } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--pyme))]">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Proyecto Emprendedurismo</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link to="/demo/select-role">Ver Demo</Link>
          </Button>
          
          <ThemeSwitcher />
          
          <Button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--pyme))] text-white hover:opacity-90"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}
