import { useEffect, useCallback, useState } from "react";

interface ArtistWorkspace {
  id: string;
  owner_user_id: string | null;
  artist_name: string | null;
  artist_email: string | null;
  artist_logo: string | null;
  share_slug: string;
  created_at: string | null;
}

interface UseContractWorkspaceProps {
  // authUser intentionally generic in local-only mode
  authUser: any;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  getErrorMessage: (error: any, context: string) => string;
  applyWorkspaceToForm: (workspace: ArtistWorkspace) => void;
  setHasLoadedDraft: (loaded: boolean) => void;
}

export function useContractWorkspace({
  authUser,
  showToast,
  getErrorMessage,
  applyWorkspaceToForm,
  setHasLoadedDraft,
}: UseContractWorkspaceProps) {
  const [workspace, setWorkspace] = useState<ArtistWorkspace | null>(null);
  const [workspaceStatus, setWorkspaceStatus] = useState("Local workspace");

  const createWorkspace = async (artistName: string, artistEmail: string) => {
    const ws: ArtistWorkspace = {
      id: "local",
      owner_user_id: null,
      artist_name: artistName || "Local Artist",
      artist_email: artistEmail || null,
      artist_logo: null,
      share_slug: "local",
      created_at: new Date().toISOString(),
    };

    setWorkspace(ws);
    setWorkspaceStatus(`Workspace: ${ws.artist_name}`);
    if (applyWorkspaceToForm) applyWorkspaceToForm(ws);
    if (showToast) showToast("Local workspace ready", "success");
    return ws;
  };

  useEffect(() => {
    // Initialize a simple local workspace
    const ws: ArtistWorkspace = {
      id: "local",
      owner_user_id: null,
      artist_name: "Local Artist",
      artist_email: null,
      artist_logo: null,
      share_slug: "local",
      created_at: new Date().toISOString(),
    };
    setWorkspace(ws);
    setWorkspaceStatus(`Workspace: ${ws.artist_name}`);
    if (applyWorkspaceToForm) applyWorkspaceToForm(ws);
    if (setHasLoadedDraft) setHasLoadedDraft(true);
  }, []);

  return {
    workspace,
    setWorkspace,
    workspaceStatus,
    setWorkspaceStatus,
    createWorkspace,
  };
}
