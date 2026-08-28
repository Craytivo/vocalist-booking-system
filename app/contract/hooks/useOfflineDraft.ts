import { useEffect } from "react";
import { secureStorage } from "../../utils/secureStorage";

interface ContractForm {
  [key: string]: any;
}

interface UseOfflineDraftProps {
  form: ContractForm;
  setForm: (form: ContractForm) => void;
  setDraftId: (id: string | null) => void;
  setHasLoadedDraft: (loaded: boolean) => void;
  setSaveStatus: (status: string) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  refreshRecentContracts: () => void;
  skipNextAutosaveRef: React.MutableRefObject<boolean>;
  initialForm: ContractForm;
}

// Local-only offline draft: persist drafts to secureStorage locally.
export function useOfflineDraft({
  form,
  setForm,
  setDraftId,
  setHasLoadedDraft,
  setSaveStatus,
  showToast,
  refreshRecentContracts,
  skipNextAutosaveRef,
  initialForm,
}: UseOfflineDraftProps) {
  // Save current form to secureStorage on every change (local-only)
  useEffect(() => {
    (async () => {
      try {
        await secureStorage.setItem("offlineDraft", form);
        localStorage.setItem("offlineDraftTimestamp", Date.now().toString());
      } catch (e) {
        console.error("Failed to save offline draft locally:", e);
      }
    })();
  }, [form]);

  const restoreOfflineDraft = async () => {
    const offlineDraft = await secureStorage.getItem("offlineDraft");
    if (offlineDraft) {
      try {
        setForm(offlineDraft);
        setDraftId(null);
        setHasLoadedDraft(true);
        setSaveStatus("Offline draft restored");
        secureStorage.removeItem("offlineDraft");
        localStorage.removeItem("offlineDraftTimestamp");
        showToast("Offline draft restored successfully", "success");
      } catch (e) {
        console.error("Failed to restore offline draft:", e);
        showToast("Failed to restore offline draft", "error");
      }
    }
  };

  return {
    isOnline: true,
    restoreOfflineDraft,
  };
}
