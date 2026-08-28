import { useEffect, useState, useCallback } from "react";

interface UseContractAuthProps {
  getErrorMessage: (error: any, context: string) => string;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  onLogout?: () => void;
}

// Local-only authentication stub. No external auth required.
export function useContractAuth({ getErrorMessage, showToast, onLogout }: UseContractAuthProps) {
  const [authUser, setAuthUser] = useState<any>({ id: "local", email: "local@local" });
  const [authStatus, setAuthStatus] = useState("Local session");
  const [userEmail, setUserEmail] = useState("local@local");

  const handleLogout = useCallback(async () => {
    setAuthUser(null);
    setAuthStatus("Signed out");
    if (onLogout) onLogout();
    showToast("Signed out (local session)", "info");
  }, [onLogout, showToast]);
n  useEffect(() => {
    // no external auth in local-only mode
  }, []);
n  return {
    authUser,
    setAuthUser,
    authStatus,
    setAuthStatus,
    userEmail,
    setUserEmail,
    handleLogout,
  };
}
