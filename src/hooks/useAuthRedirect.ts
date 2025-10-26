import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export function useAuthRedirect() {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // No user - stay on landing
    if (!user) {
      return;
    }

    // User but no onboarding - go to onboarding
    if (user && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
      return;
    }

    // User with onboarding complete - go to dashboard
    if (user && profile && profile.onboarding_completed) {
      navigate("/dashboard");
      return;
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
}
