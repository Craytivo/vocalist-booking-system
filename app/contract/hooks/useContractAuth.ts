import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabaseClient";

interface UseContractAuthProps {
  getErrorMessage: (error: any, context: string) => string;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  onLogout?: () => void;
}

export function useContractAuth({ getErrorMessage, showToast, onLogout }: UseContractAuthProps) {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState("Checking sign-in...");
  const [userEmail, setUserEmail] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      if (onLogout) onLogout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast(getErrorMessage(error, "auth"), "error");
    }
  }, [router, getErrorMessage, showToast, onLogout]);

  useEffect(() => {
    if (!supabase) {
      setAuthStatus("Add Supabase keys to enable secure artist login");
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setAuthUser(data.user);
      setUserEmail(data.user?.email || "");
      setAuthStatus(data.user ? `Signed in as ${data.user.email}` : "Sign in required");
      if (!data.user) {
        router.push("/login");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
      setUserEmail(session?.user?.email || "");
      setAuthStatus(session?.user ? `Signed in as ${session.user.email}` : "Sign in required");
      if (!session?.user) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Check email verification status
  useEffect(() => {
    if (authUser && !authUser.email_confirmed_at) {
      showToast("Please verify your email address", "info");
    }
  }, [authUser, showToast]);

  // Session timeout - auto-logout after 30 minutes of inactivity
  useEffect(() => {
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    const resetTimeout = () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
      setSessionTimeout(
        setTimeout(() => {
          handleLogout();
          showToast("Session expired. Please sign in again.", "info");
        }, SESSION_TIMEOUT)
      );
    };

    const handleActivity = () => {
      resetTimeout();
    };

    // Track user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetTimeout();

    return () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [sessionTimeout, handleLogout, showToast]);

  return {
    authUser,
    setAuthUser,
    authStatus,
    setAuthStatus,
    userEmail,
    setUserEmail,
    handleLogout,
  };
}
