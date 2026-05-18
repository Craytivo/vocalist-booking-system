import { useEffect, useCallback, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabaseClient";

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
  authUser: User | null;
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
  const [workspaceStatus, setWorkspaceStatus] = useState("Loading workspace...");

  const createWorkspaceSlug = (name: string) =>
    `${name || "artist"}-${Math.random().toString(36).slice(2, 8)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const createWorkspace = async (artistName: string, artistEmail: string) => {
    if (!supabase || !authUser) {
      showToast("Sign in before creating a workspace", "error");
      return;
    }

    const shareSlug = createWorkspaceSlug(artistName);
    const { data, error } = await supabase
      .from("artist_workspaces")
      .insert({
        owner_user_id: authUser.id,
        artist_name: artistName,
        artist_email: artistEmail,
        share_slug: shareSlug,
      })
      .select("*")
      .single<ArtistWorkspace>();

    if (error) {
      setWorkspaceStatus(getErrorMessage(error, "supabase"));
      showToast(getErrorMessage(error, "supabase"), "error");
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
      if (!supabase) {
        setWorkspaceStatus("Add Supabase keys to enable workspaces");
        setHasLoadedDraft(true);
        return;
      }

      if (!authUser) {
        setWorkspaceStatus("Sign in to access your workspace");
        setHasLoadedDraft(true);
        return;
      }

      // Load workspace by owner_user_id
      const { data, error } = await supabase
        .from("artist_workspaces")
        .select("*")
        .eq("owner_user_id", authUser.id)
        .maybeSingle<ArtistWorkspace>();

      if (error) {
        setWorkspaceStatus(getErrorMessage(error, "supabase"));
        setHasLoadedDraft(true);
        return;
      }

      if (!data) {
        // Auto-create workspace if user doesn't have one
        const shareSlug = createWorkspaceSlug(authUser.email || "artist");
        const { data: newWorkspace, error: createError } = await supabase
          .from("artist_workspaces")
          .insert({
            owner_user_id: authUser.id,
            artist_name: authUser.email?.split("@")[0] || "Artist",
            artist_email: authUser.email,
            share_slug: shareSlug,
          })
          .select("*")
          .single<ArtistWorkspace>();

        if (createError) {
          setWorkspaceStatus(getErrorMessage(createError, "supabase"));
          setHasLoadedDraft(true);
          return;
        }

        setWorkspace(newWorkspace);
        setWorkspaceStatus(`Workspace: ${newWorkspace.artist_name || newWorkspace.share_slug}`);
        applyWorkspaceToForm(newWorkspace);
        showToast("Workspace created automatically", "success");
      } else {
        setWorkspace(data);
        setWorkspaceStatus(`Workspace: ${data.artist_name || data.share_slug}`);
        applyWorkspaceToForm(data);
      }

      setHasLoadedDraft(true);
    };

    loadWorkspace();
  }, [authUser]);

  return {
    workspace,
    setWorkspace,
    workspaceStatus,
    setWorkspaceStatus,
    createWorkspace,
  };
}
