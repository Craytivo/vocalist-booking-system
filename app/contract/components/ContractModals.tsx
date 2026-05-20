"use client";

import React, { memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button";
import InputField from "./InputField";
import SelectField from "./SelectField";

interface ContractVersion {
  id: string;
  version_number: number;
  created_at: string;
  created_by: string;
  version_note: string;
}

interface ContractModalsProps {
  showDeleteModal: boolean;
  showWorkspaceModal: boolean;
  showMailClientModal: boolean;
  showQuickStart: boolean;
  showSaveVersionModal: boolean;
  showRestoreConfirmation: boolean;
  showVersionHistory: boolean;
  workspaceArtistName: string;
  workspaceArtistEmail: string;
  versionNote: string;
  quickStartArtistName: string;
  quickStartClientName: string;
  quickStartFee: string;
  quickStartDate: string;
  quickStartBookingType: string;
  versionToRestore: any;
  contractVersions: ContractVersion[];
  activeVersionNumber: number | null;
  draftId: string | null;
  supabase: any;
  bookingPresets: any[];
  setShowDeleteModal: (show: boolean) => void;
  setShowWorkspaceModal: (show: boolean) => void;
  setShowMailClientModal: (show: boolean) => void;
  setShowQuickStart: (show: boolean) => void;
  setShowSaveVersionModal: (show: boolean) => void;
  setShowRestoreConfirmation: (show: boolean) => void;
  setShowVersionHistory: (show: boolean) => void;
  setWorkspaceArtistName: (name: string) => void;
  setWorkspaceArtistEmail: (email: string) => void;
  setVersionNote: (note: string) => void;
  setQuickStartArtistName: (name: string) => void;
  setQuickStartClientName: (name: string) => void;
  setQuickStartFee: (fee: string) => void;
  setQuickStartDate: (date: string) => void;
  setQuickStartBookingType: (type: string) => void;
  setVersionToRestore: (version: any) => void;
  confirmDeleteContract: () => void;
  createWorkspace: (name: string, email: string) => void;
  openGmailDraft: () => void;
  openDefaultMailClient: () => void;
  handleQuickStart: (data: any) => void;
  saveContractVersion: (id: string, form: any, note: string) => Promise<void>;
  loadContractVersions: (id: string) => Promise<void>;
  restoreContractVersion: (version: any) => void;
  confirmRestoreVersion: () => void;
  form: any;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

function ContractModals({
  showDeleteModal,
  showWorkspaceModal,
  showMailClientModal,
  showQuickStart,
  showSaveVersionModal,
  showRestoreConfirmation,
  showVersionHistory,
  workspaceArtistName,
  workspaceArtistEmail,
  versionNote,
  quickStartArtistName,
  quickStartClientName,
  quickStartFee,
  quickStartDate,
  quickStartBookingType,
  versionToRestore,
  contractVersions,
  activeVersionNumber,
  draftId,
  supabase,
  bookingPresets,
  setShowDeleteModal,
  setShowWorkspaceModal,
  setShowMailClientModal,
  setShowQuickStart,
  setShowSaveVersionModal,
  setShowRestoreConfirmation,
  setShowVersionHistory,
  setWorkspaceArtistName,
  setWorkspaceArtistEmail,
  setVersionNote,
  setQuickStartArtistName,
  setQuickStartClientName,
  setQuickStartFee,
  setQuickStartDate,
  setQuickStartBookingType,
  setVersionToRestore,
  confirmDeleteContract,
  createWorkspace,
  openGmailDraft,
  openDefaultMailClient,
  handleQuickStart,
  saveContractVersion,
  loadContractVersions,
  restoreContractVersion,
  confirmRestoreVersion,
  form,
  showToast,
}: ContractModalsProps) {
  // Memoize modal close handlers
  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, [setShowDeleteModal]);

  const handleCloseWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal(false);
  }, [setShowWorkspaceModal]);

  const handleCloseMailClientModal = useCallback(() => {
    setShowMailClientModal(false);
  }, [setShowMailClientModal]);

  const handleCloseQuickStart = useCallback(() => {
    setShowQuickStart(false);
  }, [setShowQuickStart]);

  const handleCloseSaveVersionModal = useCallback(() => {
    setShowSaveVersionModal(false);
    setVersionNote("");
  }, [setShowSaveVersionModal, setVersionNote]);

  const handleCloseRestoreConfirmation = useCallback(() => {
    setShowRestoreConfirmation(false);
    setVersionToRestore(null);
  }, [setShowRestoreConfirmation, setVersionToRestore]);

  const handleCloseVersionHistory = useCallback(() => {
    setShowVersionHistory(false);
  }, [setShowVersionHistory]);

  // Handle keyboard escape to close modals
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDeleteModal) handleCloseDeleteModal();
        if (showWorkspaceModal) handleCloseWorkspaceModal();
        if (showMailClientModal) handleCloseMailClientModal();
        if (showQuickStart) handleCloseQuickStart();
        if (showSaveVersionModal) handleCloseSaveVersionModal();
        if (showRestoreConfirmation) handleCloseRestoreConfirmation();
        if (showVersionHistory) handleCloseVersionHistory();
      }
    },
    [
      showDeleteModal,
      showWorkspaceModal,
      showMailClientModal,
      showQuickStart,
      showSaveVersionModal,
      showRestoreConfirmation,
      showVersionHistory,
      handleCloseDeleteModal,
      handleCloseWorkspaceModal,
      handleCloseMailClientModal,
      handleCloseQuickStart,
      handleCloseSaveVersionModal,
      handleCloseRestoreConfirmation,
      handleCloseVersionHistory,
    ]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 leading-tight mb-2">Delete Contract</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete this contract? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCloseDeleteModal}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={confirmDeleteContract}
                className="flex-1 rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-error/80"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Workspace Modal */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 leading-tight">Artist Workspace</h2>
              <button
                type="button"
                onClick={handleCloseWorkspaceModal}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <p className="mb-5 text-sm text-neutral-600">
              Create a workspace so each artist gets an isolated demo link, saved drafts, and version history.
            </p>

            <div className="space-y-4">
              <InputField
                label="Artist Name"
                value={workspaceArtistName}
                onChange={(event) => setWorkspaceArtistName(event.target.value)}
                placeholder="Artist or performer name"
              />
              <InputField
                label="Artist Email"
                type="email"
                value={workspaceArtistEmail}
                onChange={(event) => setWorkspaceArtistEmail(event.target.value)}
                placeholder="artist@example.com"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCloseWorkspaceModal}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => createWorkspace(workspaceArtistName, workspaceArtistEmail)}
                fullWidth
              >
                Create Workspace
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mail Client Modal */}
      {showMailClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 leading-tight">Choose Mail Client</h2>
              <button
                type="button"
                onClick={handleCloseMailClientModal}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <p className="mb-5 text-sm text-neutral-600">
              Your contract PDF has been downloaded. Choose where to open the email draft, then attach the downloaded PDF manually.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="md"
                onClick={openGmailDraft}
                fullWidth
              >
                Open in Gmail
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={openDefaultMailClient}
                fullWidth
              >
                Open Default Mail App
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Modal */}
      {showQuickStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 leading-tight">Quick Start</h2>
              <button
                type="button"
                onClick={handleCloseQuickStart}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleQuickStart({
                  artistName: formData.get("artistName") as string,
                  clientName: formData.get("clientName") as string,
                  fee: formData.get("fee") as string,
                  date: formData.get("date") as string,
                  preset: formData.get("preset") as string,
                });
              }}
            >
              <div className="space-y-6">
                <InputField
                  label="Artist Name"
                  value={quickStartArtistName}
                  onChange={(event) => setQuickStartArtistName(event.target.value)}
                  placeholder="Avery Simone"
                />
                <InputField
                  label="Client Name"
                  value={quickStartClientName}
                  onChange={(event) => setQuickStartClientName(event.target.value)}
                  placeholder="Acme Events"
                />
                <InputField
                  label="Fee (CAD)"
                  type="number"
                  value={quickStartFee}
                  onChange={(event) => setQuickStartFee(event.target.value)}
                  placeholder="500"
                />
                <InputField
                  label="Event Date"
                  type="date"
                  value={quickStartDate}
                  onChange={(event) => setQuickStartDate(event.target.value)}
                />
                <SelectField
                  label="Booking Type"
                  value={quickStartBookingType}
                  onChange={(event) => setQuickStartBookingType(event.target.value)}
                  options={bookingPresets.map((preset) => preset.label)}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleCloseQuickStart}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  fullWidth
                >
                  Create Contract
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Version Modal */}
      {showSaveVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 leading-tight">Save Version</h2>
              <button
                type="button"
                onClick={handleCloseSaveVersionModal}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <InputField
                label="Version Note (optional)"
                value={versionNote}
                onChange={(e) => setVersionNote(e.target.value)}
                placeholder="e.g., Final version before signing"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCloseSaveVersionModal}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={async () => {
                  if (draftId) {
                    await saveContractVersion(draftId, form, versionNote || "Manual save");
                    await loadContractVersions(draftId);
                    setShowSaveVersionModal(false);
                    setVersionNote("");
                    setShowVersionHistory(true);
                    showToast("Version saved successfully", "success");
                  }
                }}
                fullWidth
              >
                Save Version
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900 leading-tight mb-2">Restore Version</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Are you sure you want to restore version {versionToRestore?.version_number}? This will replace your current contract with this version.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCloseRestoreConfirmation}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={confirmRestoreVersion}
                fullWidth
              >
                Restore
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 leading-tight">Version History</h2>
              <button
                type="button"
                onClick={handleCloseVersionHistory}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {contractVersions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-500">No version history available</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2">
                {contractVersions.map((version) => (
                  <div
                    key={version.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      activeVersionNumber === version.version_number
                        ? "border-amber-500 bg-amber-50"
                        : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-neutral-900">Version {version.version_number}</span>
                        <span className="text-xs text-neutral-400">•</span>
                        <span className="text-xs text-neutral-500">
                          {new Date(version.created_at).toLocaleDateString()}{" "}
                          {new Date(version.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {activeVersionNumber === version.version_number && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-stone-950 text-amber-100 dark:bg-amber-200 dark:text-stone-950 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 mb-1">by {version.created_by}</p>
                      {version.version_note && version.version_note !== "Autosave" && (
                        <p className="text-xs text-amber-700 font-medium">{version.version_note}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => restoreContractVersion(version)}
                      >
                        Restore
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={async () => {
                          if (supabase && confirm("Are you sure you want to delete this version?")) {
                            await supabase.from("contract_versions").delete().eq("id", version.id);
                            if (draftId) {
                              await loadContractVersions(draftId);
                            }
                            showToast("Version deleted", "success");
                          }
                        }}
                        title="Delete version"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(ContractModals);
