import React from "react";
import Button from "../../components/Button";

interface FormPanelProps {
  activePanel: string;
  focusMode: boolean;
  setShowQuickStart: (show: boolean) => void;
  startNewContract: () => void;
  draftId: string | null;
  supabase: any;
  setShowSaveVersionModal: (show: boolean) => void;
  loadContractVersions: (id: string) => void;
  generateCalendarEvent: () => void;
  saveStatus: string;
  isOnline: boolean;
  readinessScore: number;
  readinessChecks: any[];
  setForm: (form: any) => void;
  updateField: (field: string, value: any) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredContracts: any[];
  loadRecentContract: (contract: any) => void;
  deleteContract: () => void;
  recentStatusFilter: string;
  setRecentStatusFilter: (filter: string) => void;
  templates: any[];
  saveTemplate: () => void;
  loadTemplate: (template: any) => void;
  deleteTemplate: (index: number) => void;
  recentContracts: any[];
}

export default function FormPanel({
  activePanel,
  focusMode,
  setShowQuickStart,
  startNewContract,
  draftId,
  supabase,
  setShowSaveVersionModal,
  loadContractVersions,
  generateCalendarEvent,
  saveStatus,
  isOnline,
  readinessScore,
  readinessChecks,
  setForm,
  updateField,
  showToast,
  searchQuery,
  setSearchQuery,
  filteredContracts,
  loadRecentContract,
  deleteContract,
  recentStatusFilter,
  setRecentStatusFilter,
  templates,
  saveTemplate,
  loadTemplate,
  deleteTemplate,
  recentContracts,
}: FormPanelProps) {
  return (
    <section
      className={`rounded-2xl border border-amber-200/80 bg-white/85 p-4 shadow-xl shadow-amber-950/10 backdrop-blur dark:border-amber-500/20 dark:bg-stone-950/80 dark:shadow-black/20 sm:p-6 lg:w-[380px] lg:overflow-y-auto lg:p-6 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:self-start relative ${
        activePanel === "preview" ? "hidden lg:block" : ""
      } ${focusMode ? "hidden" : ""}`}
    >
      <div className="flex flex-col gap-5 sm:gap-6 mb-6">
        {/* Primary Actions */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700 mb-3">Primary Actions</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowQuickStart(true)}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span>Quick Start</span>
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={startNewContract}
            >
              New Contract
            </Button>
          </div>
        </div>

        {/* Contract Actions */}
        {draftId && supabase && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700 mb-3">Contract Actions</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowSaveVersionModal(true)}
              >
                Save Version
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => loadContractVersions(draftId)}
              >
                Version History
              </Button>
            </div>
          </div>
        )}

        {/* Utilities */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700 mb-3">Utilities</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={generateCalendarEvent}
            >
              Add to Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Save Status */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-gradient-to-r from-white/90 to-amber-50/80 px-4 py-3 flex items-center gap-3 shadow-sm shadow-amber-950/5">
        <span className={`h-2 w-2 rounded-full ${saveStatus.includes("failed") ? "bg-red-500" : saveStatus.includes("Saving") ? "bg-amber-500" : "bg-emerald-500"}`} />
        <p className="text-sm text-neutral-700">{!isOnline ? "Offline - saved locally" : saveStatus}</p>
        {!isOnline && (
          <span className="ml-auto rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
            Offline
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4 rounded-lg border border-amber-200/70 bg-white/60 px-3 py-2 shadow-sm shadow-amber-950/5 dark:border-amber-500/20 dark:bg-stone-900/60">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-600 dark:text-stone-300">Progress</span>
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">{readinessScore}% ready</span>
        </div>
        {readinessScore < 100 && (
          <div className="mt-2 space-y-1 border-t border-amber-100 pt-2 dark:border-amber-500/20">
            {readinessChecks.filter((item) => !item.complete).slice(0, 2).map((item) => (
              <div key={item.field} className="flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-stone-400">
                <span className="truncate">{item.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (item.field === "services") {
                      setForm((prev: any) => ({ ...prev, services: ["Solo Vocal Performance"] }));
                    } else if (item.field === "depositTerms") {
                      updateField("depositTerms", "A 50% deposit is required to confirm the booking.");
                    } else if (item.field === "cancellationTerms") {
                      updateField("cancellationTerms", "Cancellations must be made at least 14 days before the event for a full refund.");
                    } else if (item.field === "technicalRequirements") {
                      updateField("technicalRequirements", "PA system with at least 2 microphones and monitor speakers required.");
                    }
                    showToast(`Added ${item.label}`, "success");
                  }}
                  className="text-amber-700 font-semibold hover:text-amber-900 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded px-1"
                >
                  Add
                </button>
              </div>
            ))}
            {readinessChecks.filter((item) => !item.complete).length > 2 && (
              <p className="text-[11px] text-stone-500 dark:text-stone-500">
                +{readinessChecks.filter((item) => !item.complete).length - 2} more
              </p>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-white/80 p-3 shadow-md shadow-amber-950/5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 mb-2">Search</p>
        <input
          type="text"
          placeholder="Search contracts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition-all hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        />
      </div>


    </section>
  );
}
