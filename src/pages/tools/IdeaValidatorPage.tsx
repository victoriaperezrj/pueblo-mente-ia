import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { InputStep } from "@/components/tools/idea-validator/InputStep";
import { AnalyzingStep } from "@/components/tools/idea-validator/AnalyzingStep";
import { ReportStep } from "@/components/tools/idea-validator/ReportStep";

interface IdeaData {
  title: string;
  description: string;
  location?: string;
  businessType?: string;
  budget?: string;
}

interface ValidationReport {
  score: number;
  marketSize: string;
  growth: string;
  competition: string;
  strengths: string[];
  risks: string[];
  investment: string;
  timeToLaunch: string;
  nextSteps: string[];
  factors: {
    market: number;
    competition: number;
    viability: number;
    profitability: number;
    scalability: number;
    differentiation: number;
  };
}

export default function IdeaValidatorPage() {
  const [currentStep, setCurrentStep] = useState<"input" | "analyzing" | "report">("input");
  const [ideaData, setIdeaData] = useState<IdeaData | null>(null);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const navigate = useNavigate();

  const handleAnalyze = (data: IdeaData) => {
    setIdeaData(data);
    setCurrentStep("analyzing");
    
    // Simulate analysis (in real app, this would call an AI service)
    setTimeout(() => {
      const mockReport: ValidationReport = {
        score: 78,
        marketSize: "$2.5M - $5M anuales en Argentina",
        growth: "15-20% anual",
        competition: "Media - 8-12 competidores directos",
        strengths: [
          "Problema real y validado en el mercado",
          "Modelo de negocio escalable",
          "Bajo costo de entrada inicial",
          "Demanda creciente en el segmento objetivo",
        ],
        risks: [
          "Competencia establecida con presencia fuerte",
          "Necesidad de inversión en marketing digital",
          "Dependencia de proveedores externos",
        ],
        investment: "$150,000 - $250,000 ARS",
        timeToLaunch: "3-4 meses",
        nextSteps: [
          "Validar la idea con 20-30 clientes potenciales",
          "Crear un MVP (Producto Mínimo Viable)",
          "Definir estrategia de pricing y posicionamiento",
          "Armar un plan de marketing digital inicial",
          "Buscar proveedores y negociar condiciones",
        ],
        factors: {
          market: 85,
          competition: 65,
          viability: 80,
          profitability: 75,
          scalability: 82,
          differentiation: 70,
        },
      };
      setReport(mockReport);
      setCurrentStep("report");
    }, 4500);
  };

  const handleReset = () => {
    setCurrentStep("input");
    setIdeaData(null);
    setReport(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container max-w-6xl">
          <AnimatePresence mode="wait">
            {currentStep === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <InputStep onAnalyze={handleAnalyze} onBack={() => navigate("/dashboard")} />
              </motion.div>
            )}

            {currentStep === "analyzing" && ideaData && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyzingStep ideaData={ideaData} />
              </motion.div>
            )}

            {currentStep === "report" && report && ideaData && (
              <motion.div
                key="report"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <ReportStep report={report} ideaData={ideaData} onReset={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
