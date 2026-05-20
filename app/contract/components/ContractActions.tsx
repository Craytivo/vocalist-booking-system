import React, { useCallback, memo } from "react";
import { FONT_SIZE_CLASSES, FONT_FAMILY_CLASSES, FONT_WEIGHT_CLASSES, BUTTON_SIZE_CLASSES } from "../../components/GlobalTypography";

interface ContractActionsProps {
  draftId: string | null;
  supabase: any;
  showTemplateLibrary: boolean;
  showAnalytics: boolean;
  setShowQuickStart: (show: boolean) => void;
  setShowSaveVersionModal: (show: boolean) => void;
  setShowTemplateLibrary: (show: boolean) => void;
  setShowAnalytics: (show: boolean) => void;
  startNewContract: () => void;
  loadContractVersions: (id: string) => void;
  handleGenerateCalendarEvent: () => void;
  saveStatus: string;
  isOnline: boolean;
}

function ContractActions({
  draftId,
  supabase,
  showTemplateLibrary,
  showAnalytics,
  setShowQuickStart,
  setShowSaveVersionModal,
  setShowTemplateLibrary,
  setShowAnalytics,
  startNewContract,
  loadContractVersions,
  handleGenerateCalendarEvent,
  saveStatus,
  isOnline,
}: ContractActionsProps) {
  // Memoize button handlers to prevent unnecessary re-renders
  const handleQuickStart = useCallback(() => {
    setShowQuickStart(true);
  }, [setShowQuickStart]);

  const handleSaveVersion = useCallback(() => {
    setShowSaveVersionModal(true);
  }, [setShowSaveVersionModal]);

  const handleToggleTemplates = useCallback(() => {
    setShowTemplateLibrary(!showTemplateLibrary);
  }, [showTemplateLibrary, setShowTemplateLibrary]);

  const handleToggleAnalytics = useCallback(() => {
    setShowAnalytics(!showAnalytics);
  }, [showAnalytics, setShowAnalytics]);

  const handleVersionHistory = useCallback(() => {
    if (draftId) {
      loadContractVersions(draftId);
    }
  }, [draftId, loadContractVersions]);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 mb-6">
      {/* Primary Actions */}
      <div>
        <p className={`${FONT_SIZE_CLASSES.uiXs} ${FONT_WEIGHT_CLASSES.semibold} uppercase tracking-[0.12em] text-amber-700 mb-3 ${FONT_FAMILY_CLASSES.heading}`}>
          Primary Actions
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleQuickStart}
            className={`rounded-lg border border-amber-300/70 bg-stone-950 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.bold} text-amber-100 shadow-md shadow-stone-950/10 transition-all duration-200 ease-out hover:border-amber-400 hover:bg-stone-900 active:scale-95 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:border-amber-400/40 dark:bg-amber-200 dark:text-stone-950 dark:hover:bg-amber-100 tracking-normal ${FONT_FAMILY_CLASSES.body}`}
            title="Start a new contract with a quick setup wizard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>Quick Start</span>
          </button>
          <button
            type="button"
            onClick={startNewContract}
            className={`rounded-lg border border-amber-200 bg-white/70 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.medium} text-stone-800 tracking-normal transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
            title="Create a blank new contract"
          >
            New Contract
          </button>
        </div>
      </div>

      {/* Contract Actions */}
      {draftId && supabase && (
        <div>
          <p className={`${FONT_SIZE_CLASSES.uiXs} ${FONT_WEIGHT_CLASSES.semibold} uppercase tracking-[0.12em] text-amber-700 mb-3 ${FONT_FAMILY_CLASSES.heading}`}>
            Contract Actions
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveVersion}
              className={`rounded-lg border border-amber-200 bg-white/70 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.medium} text-stone-800 tracking-normal transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
              title="Save a version of this contract"
            >
              Save Version
            </button>
            <button
              type="button"
              onClick={handleVersionHistory}
              className={`rounded-lg border border-amber-200 bg-white/70 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.medium} text-stone-800 tracking-normal transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
              title="View version history"
            >
              Version History
            </button>
          </div>
        </div>
      )}

      {/* Utilities */}
      <div>
        <p className={`${FONT_SIZE_CLASSES.uiXs} ${FONT_WEIGHT_CLASSES.semibold} uppercase tracking-[0.12em] text-amber-700 mb-3 ${FONT_FAMILY_CLASSES.heading}`}>
          Utilities
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateCalendarEvent}
            className={`rounded-lg border border-amber-200 bg-white/70 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.medium} text-stone-800 tracking-normal transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
            title="Generate calendar event"
          >
            Calendar Event
          </button>
          <button
            type="button"
            onClick={handleToggleTemplates}
            className={`rounded-lg border border-amber-200 bg-white/70 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.medium} text-stone-800 tracking-normal transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
            title="Toggle template library"
          >
            Templates
          </button>
          <button
            type="button"
            onClick={handleToggleAnalytics}
            className={`rounded-lg border border-amber-200 bg-white/70 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.medium} text-stone-800 tracking-normal transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
            title={showAnalytics ? "Close analytics" : "View analytics"}
          >
            {showAnalytics ? "Close" : "Analytics"}
          </button>
        </div>
      </div>

      {/* Save Status */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-gradient-to-r from-white/90 to-amber-50/80 px-4 py-3 flex items-center gap-3 shadow-sm shadow-amber-950/5">
        <span
          className={`h-2 w-2 rounded-full ${
            saveStatus.includes("failed")
              ? "bg-red-500"
              : saveStatus.includes("Saving")
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
        />
        <p className="text-sm text-neutral-700">
          {!isOnline ? "Offline - saved locally" : saveStatus}
        </p>
        {!isOnline && (
          <span className="ml-auto rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
            Offline
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(ContractActions);
