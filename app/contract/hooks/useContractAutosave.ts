import React, { useRef } from "react";

interface ArtistWorkspace { id: string; }
interface ContractForm { [key: string]: any; }
interface UseContractAutosaveProps {
  form: ContractForm;
  draftId: string | null;
  workspace: ArtistWorkspace | null;
  hasLoadedDraft: boolean;
  skipNextAutosaveRef: React.MutableRefObject<boolean>;
  skipRefreshRef: React.MutableRefObject<boolean>;
  setSaveStatus: (status: string) => void;
  setDraftId: (id: string | null) => void;
  getErrorMessage: (error: any, context: string) => string;
  refreshRecentContracts: () => void;
  saveContractVersion: (contractId: string, contractData: ContractForm) => void;
}

// Autosave disabled in local-only simplified mode.
export function useContractAutosave({
  form,
  draftId,
  workspace,
  hasLoadedDraft,
  skipNextAutosaveRef,
  skipRefreshRef,
  setSaveStatus,
  setDraftId,
  getErrorMessage,
  refreshRecentContracts,
  saveContractVersion,
}: UseContractAutosaveProps) {
  const versionSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedFormRef = useRef<string>("");

  // Inform UI that autosave is disabled (local-only)
  if (setSaveStatus) {
    setSaveStatus("Autosave disabled (local-only)");
  }

  return {
    versionSaveTimeoutRef,
    lastSavedFormRef,
  };
}
