import React, { useMemo, useCallback, useEffect } from "react";

interface WizardStep {
  id: number;
  name: string;
  sections: string[];
}

const STEP_META: Record<number, { title: string; description: string }> = {
  1: { title: "Booking basics", description: "Identify the artist, client, and engagement." },
  2: { title: "Services", description: "Define what the artist is providing and how the performance works." },
  3: { title: "Payment", description: "Set the fee, deposit, balance, and cancellation terms." },
  4: { title: "Booking details", description: "Add the practical options that shape the engagement." },
  5: { title: "Production", description: "Confirm sound, rehearsal, technical, travel, and venue requirements." },
  6: { title: "Legal terms", description: "Review the legal protections and contract language." },
  7: { title: "Final details", description: "Finish hospitality, publicity, and the information needed to send the agreement." },
};

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
  const steps = useMemo(() => wizardSteps, [wizardSteps]);
  const currentStep = steps.find((step) => step.id === wizardStep) || steps[0];
  const meta = STEP_META[wizardStep] || {
    title: currentStep?.name || "Contract details",
    description: "Complete the information for this stage of the booking.",
  };
  const progressPercentage = steps.length
    ? Math.round((wizardStep / steps.length) * 100)
    : 0;

  const goToStep = useCallback(
    (step: number) => {
      if (step < 1 || step > steps.length) return;
      setWizardStep(step);
      window.setTimeout(() => {
        const form = document.getElementById("contract-form-workspace");
        form?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    },
    [setWizardStep, steps.length]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!wizardMode) return;
      if (e.key === "ArrowRight" && wizardStep < steps.length) {
        e.preventDefault();
        goToStep(wizardStep + 1);
      } else if (e.key === "ArrowLeft" && wizardStep > 1) {
        e.preventDefault();
        goToStep(wizardStep - 1);
      }
    },
    [wizardMode, wizardStep, steps.length, goToStep]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!wizardMode || !steps.length) return null;

  return (
    <div className="mb-7 rounded-2xl border border-neutral-200 bg-white shadow-sm shadow-neutral-900/5 overflow-hidden">
      <div className="border-b border-neutral-200 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Guided booking
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="text-xs font-medium text-neutral-500">
                Step {wizardStep} of {steps.length}
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              {meta.title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
              {meta.description}
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-neutral-50 px-3 py-2 text-right">
            <div className="text-lg font-semibold leading-none text-neutral-950">{progressPercentage}%</div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">complete</div>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-neutral-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-neutral-950 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <nav aria-label="Contract workflow" className="overflow-x-auto px-3 py-3 sm:px-5">
        <ol className="flex min-w-max items-center gap-1">
          {steps.map((step, index) => {
            const isCurrent = step.id === wizardStep;
            const isComplete = step.id < wizardStep;
            return (
              <React.Fragment key={step.id}>
                <li>
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    aria-current={isCurrent ? "step" : undefined}
                    title={STEP_META[step.id]?.description || step.name}
                    className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                      isCurrent
                        ? "bg-neutral-950 text-white"
                        : isComplete
                        ? "text-neutral-800 hover:bg-neutral-100"
                        : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700"
                    }`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                      isCurrent
                        ? "bg-white text-neutral-950"
                        : isComplete
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
                    }`}>
                      {isComplete ? "✓" : step.id}
                    </span>
                    <span className="text-xs font-medium sm:text-sm">
                      {STEP_META[step.id]?.title || step.name}
                    </span>
                  </button>
                </li>
                {index < steps.length - 1 && (
                  <li className="h-px w-4 bg-neutral-200" aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>

      <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/70 px-5 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => goToStep(wizardStep - 1)}
          disabled={wizardStep === 1}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden="true">←</span>
          Back
        </button>
        <span className="hidden text-xs text-neutral-400 sm:block">Use ← → to move between sections</span>
        <button
          type="button"
          onClick={() => goToStep(wizardStep + 1)}
          disabled={wizardStep === steps.length}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {wizardStep === steps.length ? "Finished" : "Continue"}
          {wizardStep !== steps.length && <span aria-hidden="true">→</span>}
        </button>
      </div>
    </div>
  );
}
