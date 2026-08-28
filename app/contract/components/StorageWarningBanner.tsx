import { SecureStorage } from "../../utils/secureStorage";
import { useState, useEffect } from "react";

export default function StorageWarningBanner() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setShowWarning(SecureStorage.shouldShowWarning());
  }, []);

  if (!showWarning) return null;

  const handleAcknowledge = () => {
    SecureStorage.acknowledgeWarning();
    setShowWarning(false);
  };

  const handleClearData = () => {
    if (confirm("This will clear all locally stored contract data. Continue?")) {
      SecureStorage.clearSensitiveData();
      handleAcknowledge();
    }
  };

  return (
    <div className="bg-slate-100 border-b border-slate-200 px-4 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">
              Local Storage Notice
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Contract drafts and templates are stored locally on this device for offline access. 
              This data is now encrypted for your privacy. Only use this feature on private devices.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleClearData}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 underline"
          >
            Clear Data
          </button>
          <button
            type="button"
            onClick={handleAcknowledge}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
