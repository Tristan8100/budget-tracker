import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface UpdateProfileParams {
  full_name: string;
}

interface UpdatePasswordParams {
  currentPassword: string;
  newPassword: string;
}

interface SettingsState {
  profileLoading: boolean;
  passwordLoading: boolean;
  profileError: string | null;
  passwordError: string | null;
  profileSuccess: boolean;
  passwordSuccess: boolean;
}

// --- Hook ---

export function useSettings() {
  const [state, setState] = useState<SettingsState>({
    profileLoading: false,
    passwordLoading: false,
    profileError: null,
    passwordError: null,
    profileSuccess: false,
    passwordSuccess: false,
  });

  // Helper to patch state
  const patch = (updates: Partial<SettingsState>) =>
    setState((prev) => ({ ...prev, ...updates }));

  /**
   * Update the user's full_name in both auth metadata and public.users table.
   */
  async function updateProfile({ full_name }: UpdateProfileParams) {
    patch({
      profileLoading: true,
      profileError: null,
      profileSuccess: false,
    });

    try {
      // 1. Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        patch({ profileError: "Not authenticated.", profileLoading: false });
        return false;
      }

      // 2. Update auth metadata (optional but keeps them in sync)
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { full_name },
      });

      if (authUpdateError) {
        patch({
          profileError: authUpdateError.message,
          profileLoading: false,
        });
        return false;
      }

      // 3. Update public.users table
      const { error: dbError } = await supabase
        .from("users")
        .update({ full_name })
        .eq("id", user.id);

      if (dbError) {
        patch({ profileError: dbError.message, profileLoading: false });
        return false;
      }

      patch({ profileSuccess: true, profileLoading: false });
      return true;
    } catch (err) {
      patch({
        profileError: "Unexpected error. Please try again.",
        profileLoading: false,
      });
      return false;
    }
  }

  /**
   * Update password — verifies current password by re-signing in first.
   */
  async function updatePassword({
    currentPassword,
    newPassword,
  }: UpdatePasswordParams) {
    patch({
      passwordLoading: true,
      passwordError: null,
      passwordSuccess: false,
    });

    try {
      // 1. Get current user's email
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        patch({
          passwordError: "Not authenticated.",
          passwordLoading: false,
        });
        return false;
      }

      // 2. Verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        patch({
          passwordError: "Current password is incorrect.",
          passwordLoading: false,
        });
        return false;
      }

      // 3. Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        patch({ passwordError: updateError.message, passwordLoading: false });
        return false;
      }

      patch({ passwordSuccess: true, passwordLoading: false });
      return true;
    } catch (err) {
      patch({
        passwordError: "Unexpected error. Please try again.",
        passwordLoading: false,
      });
      return false;
    }
  }

  /** Reset profile status (e.g. on form change) */
  function resetProfileStatus() {
    patch({ profileError: null, profileSuccess: false });
  }

  /** Reset password status */
  function resetPasswordStatus() {
    patch({ passwordError: null, passwordSuccess: false });
  }

  return {
    ...state,
    updateProfile,
    updatePassword,
    resetProfileStatus,
    resetPasswordStatus,
  };
}