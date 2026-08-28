import React, { useMemo, useCallback, useEffect } from "react";

interface WizardStep {
  id: number;
  name: string;
  sections: string[];
}

interface ContractWizardProps {
  wizardMode: boolean;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  wizardSteps: WizardStep[];
}

export default function ContractWizard({
  wizardMode,
  wizardStep,
  setWizardStep,
  wizardSteps,
}: ContractWizardProps) {
  // Memoize wizard steps to prevent unnecessary re-renders
  const steps = useMemo(() => wizardSteps, [wizardSteps]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return Math.round((wizardStep / steps.length) * 100);
  }, [wizardStep, steps.length]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!wizardMode) return;

      if (e.key === "ArrowRight" && wizardStep < steps.length) {
        setWizardStep(wizardStep + 1);
      } else if (e.key === "ArrowLeft" && wizardStep > 1) {
        setWizardStep(wizardStep - 1);
      }
    },
    [wizardMode, wizardStep, steps.length, setWizardStep]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!wizardMode) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Wizard Mode</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">
            Step {wizardStep} of {steps.length}
          </span>
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
            {progressPercentage}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                step.id <= wizardStep
                  ? "bg-stone-700"
                  : "bg-amber-100"
              }`}
            />
            {index < steps.length - 1 && (
              <div className="w-2 h-2 rounded-full bg-neutral-200" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step navigation buttons */}
      <div className="flex gap-2 flex-wrap">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setWizardStep(step.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              step.id === wizardStep
                ? "bg-stone-950 text-amber-100 dark:bg-amber-200 dark:text-stone-950"
                : step.id < wizardStep
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-white/80 text-stone-600 hover:bg-amber-50 border border-amber-100"
            }`}
            aria-current={step.id === wizardStep ? "step" : undefined}
          >
            {step.id}. {step.name}
          </button>
        ))}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-3 text-xs text-neutral-500">
        <span className="font-medium">Tip:</span> Use ← → arrow keys to navigate
      </div>
    </div>
  );
}
