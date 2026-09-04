import { CalendarCheck, FileCheck2, PenLine, Send } from "lucide-react";

const steps = [
  { label: "Details", icon: CalendarCheck },
  { label: "Terms", icon: FileCheck2 },
  { label: "Review", icon: PenLine },
  { label: "Send", icon: Send },
];

export default function WorkflowGuide({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between gap-2">
        {steps.map(({ label, icon: Icon }, index) => {
          const step = index + 1;
          const active = step === currentStep;
          const complete = step < currentStep;
          return (
            <div key={label} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  active ? "bg-indigo-600 text-white" : complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                }`}>
                  <Icon size={14} strokeWidth={1.9} />
                </span>
                <span className={`hidden truncate text-xs font-medium sm:block ${active ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
              </div>
              {step < steps.length && <span className="mx-2 h-px flex-1 bg-slate-200" aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
