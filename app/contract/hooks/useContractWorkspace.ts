import { useEffect, useCallback, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import type { LocalUser } from "./useContractAuth";

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
  authUser: LocalUser | null;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  getErrorMessage: (error: any, context: string) => string;
  applyWorkspaceToForm: (workspace: ArtistWorkspace) => void;
  setHasLoadedDraft: (loaded: boolean) => void;
}

export function useContractWorkspace({ authUser, showToast, getErrorMessage, applyWorkspaceToForm, setHasLoadedDraft }: UseContractWorkspaceProps) {
  const [workspace, setWorkspace] = useState<ArtistWorkspace | null>(null);
  const [workspaceStatus, setWorkspaceStatus] = useState("Loading workspace...");

  const createWorkspaceSlug = (name: string) =>
    `${name || "artist"}-${Math.random().toString(36).slice(2, 8)}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const createWorkspace = async (artistName: string, artistEmail: string) => {
    if (!authUser) {
      showToast("Local workspace is not ready yet", "error");
      return;
    }
    const shareSlug = createWorkspaceSlug(artistName);
    const { data, error } = await supabase.from("artist_workspaces").insert({
      owner_user_id: authUser.id,
      artist_name: artistName,
      artist_email: artistEmail,
      share_slug: shareSlug,
    }).select("*").single<ArtistWorkspace>();

    if (error) {
      const message = getErrorMessage(error, "workspace");
      setWorkspaceStatus(message);
      showToast(message, "error");
      return;
    }
    setWorkspace(data);
    setWorkspaceStatus(`Workspace: ${data.artist_name || data.share_slug}`);
    applyWorkspaceToForm(data);
    showToast("Artist workspace ready", "success");
    return data;
  };

  useEffect(() => {
    const loadWorkspace = async () => {
      if (!authUser) {
        setWorkspaceStatus("Local workspace ready");
        setHasLoadedDraft(true);
        return;
      }
      const { data, error } = await supabase.from("artist_workspaces").select("*").eq("owner_user_id", authUser.id).maybeSingle<ArtistWorkspace>();
      if (error) {
        setWorkspaceStatus(getErrorMessage(error, "workspace"));
        setHasLoadedDraft(true);
        return;
      }
      if (!data) {
        const created = await createWorkspace(authUser.email.split("@")[0] || "Artist", authUser.email);
        if (!created) setHasLoadedDraft(true);
      } else {
        setWorkspace(data);
        setWorkspaceStatus(`Workspace: ${data.artist_name || data.share_slug}`);
        applyWorkspaceToForm(data);
        setHasLoadedDraft(true);
      }
    };
    void loadWorkspace();
  }, [authUser]);

  return { workspace, setWorkspace, workspaceStatus, setWorkspaceStatus, createWorkspace };
}
