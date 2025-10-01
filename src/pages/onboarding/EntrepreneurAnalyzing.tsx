import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const EntrepreneurAnalyzing = () => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Analizando competencia en la zona...",
    "Evaluando poder adquisitivo del mercado...",
    "Revisando regulaciones provinciales...",
    "Calculando inversión inicial...",
    "Generando recomendaciones..."
  ];

  useEffect(() => {
    // Rotate messages every 2 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    // Redirect after 8 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/onboarding/entrepreneur/results');
    }, 8000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md space-y-8 animate-fade-in text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-primary/50 opacity-20 animate-pulse" />
          </div>
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            Analizando tu idea...
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in" key={currentMessage}>
            {messages[currentMessage]}
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          {messages.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentMessage
                  ? "bg-primary w-8"
                  : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurAnalyzing;
