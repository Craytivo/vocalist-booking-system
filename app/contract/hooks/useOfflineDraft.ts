import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
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
  const [isOnline, setIsOnline] = useState(true);

  // Detect online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Back online - syncing with Supabase", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("You're offline - saving to local storage", "info");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Auto-save to localStorage when offline
  useEffect(() => {
    if (!isOnline) {
      secureStorage.setItem("offlineDraft", form);
      localStorage.setItem("offlineDraftTimestamp", Date.now().toString());
    }
  }, [form, isOnline]);

  // Load offline draft when coming back online
  useEffect(() => {
    if (isOnline && supabase) {
      const loadOfflineDraft = async () => {
        const offlineDraft = await secureStorage.getItem("offlineDraft");
        const offlineTimestamp = localStorage.getItem("offlineDraftTimestamp");
        if (offlineDraft && offlineTimestamp) {
          const timeDiff = Date.now() - parseInt(offlineTimestamp);
          // If offline draft is less than 24 hours old, offer to restore
          if (timeDiff < 86400000) {
            showToast("Offline draft available - use Recent Contracts to restore", "info");
          }
        }
      };
      loadOfflineDraft();
    }
  }, [isOnline, supabase, showToast]);

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
    isOnline,
    restoreOfflineDraft,
  };
}
