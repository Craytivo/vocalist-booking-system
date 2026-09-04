import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface LocalUser {
  id: string;
  email: string;
  email_confirmed_at: string;
}

interface UseContractAuthProps {
  getErrorMessage: (error: any, context: string) => string;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  onLogout?: () => void;
}

export function useContractAuth({ getErrorMessage, showToast, onLogout }: UseContractAuthProps) {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<LocalUser | null>(null);
  const [authStatus, setAuthStatus] = useState("Local workspace ready");
  const [userEmail, setUserEmail] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      onLogout?.();
      setAuthUser(null);
      setUserEmail("");
      setAuthStatus("Local workspace ready");
      router.push("/dashboard");
    } catch (error) {
      console.error("Logout error:", error);
      showToast(getErrorMessage(error, "workspace"), "error");
    }
  }, [getErrorMessage, showToast, onLogout, router]);

  useEffect(() => {
    // Authentication is intentionally local-only. The contract workspace does not
    // depend on a remote authentication or database provider.
    setAuthStatus("Local workspace ready");
  }, []);

  useEffect(() => {
    const SESSION_TIMEOUT = 30 * 60 * 1000;
    const resetTimeout = () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
      setSessionTimeout(setTimeout(() => {
        handleLogout();
        showToast("Workspace session expired. Your local drafts remain on this device.", "info");
      }, SESSION_TIMEOUT));
    };
    const handleActivity = () => resetTimeout();
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimeout();
    return () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [sessionTimeout, handleLogout, showToast]);

  return { authUser, setAuthUser, authStatus, setAuthStatus, userEmail, setUserEmail, handleLogout };
}
