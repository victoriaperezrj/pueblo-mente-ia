import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { StageSelectionStep } from "@/components/onboarding/StageSelectionStep";
import { FormStep } from "@/components/onboarding/FormStep";
import { AnalyzingStep } from "@/components/onboarding/AnalyzingStep";

type Stage = "entrepreneur" | "business" | "pyme_enterprise" | null;

export default function NewOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStage, setSelectedStage] = useState<Stage>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const handleStageSelect = (stage: Stage) => {
    setSelectedStage(stage);
    handleNext();
  };

  const handleFormSubmit = (data: Record<string, string>) => {
    setFormData(data);
    handleNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--entrepreneur))] via-[hsl(var(--pyme))] to-[hsl(var(--accent-pink))] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeStep onNext={handleNext} />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="stage"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <StageSelectionStep onSelect={handleStageSelect} onBack={handleBack} />
          </motion.div>
        )}

        {currentStep === 3 && selectedStage && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <FormStep stage={selectedStage} onSubmit={handleFormSubmit} onBack={handleBack} />
          </motion.div>
        )}

        {currentStep === 4 && selectedStage && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalyzingStep stage={selectedStage} formData={formData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
