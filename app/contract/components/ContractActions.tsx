import React, { useCallback, memo } from "react";
import { FONT_SIZE_CLASSES, FONT_FAMILY_CLASSES, FONT_WEIGHT_CLASSES } from "../../components/GlobalTypography";
import Button from "../../components/Button";

interface ContractActionsProps {
  draftId: string | null;
  setShowQuickStart: (show: boolean) => void;
  setShowSaveVersionModal: (show: boolean) => void;
  startNewContract: () => void;
  loadContractVersions: (id: string) => void;
  saveStatus: string;
  isOnline: boolean;
}

function ContractActions({
  draftId,
  setShowQuickStart,
  setShowSaveVersionModal,
  startNewContract,
  loadContractVersions,
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
          <Button
            variant="primary"
            size="md"
            onClick={handleQuickStart}
            title="Start a new contract with a quick setup wizard"
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
            title="Create a blank new contract"
          >
            New Contract
          </Button>
        </div>
      </div>

      {/* Contract Actions */}
      {draftId && (
        <div>
          <p className={`${FONT_SIZE_CLASSES.uiXs} ${FONT_WEIGHT_CLASSES.semibold} uppercase tracking-[0.12em] text-amber-700 mb-3 ${FONT_FAMILY_CLASSES.heading}`}>
            Contract Actions
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleSaveVersion}
              title="Save a version of this contract"
            >
              Save Version
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleVersionHistory}
              title="View version history"
            >
              Version History
            </Button>
          </div>
        </div>
      )}


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
