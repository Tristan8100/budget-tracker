"use client";

import { useEffect, useState } from "react";
import { useSettings } from "./useSettings";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const supabase = createClient();

export default function SettingsPage() {
  
  const [fullName, setFullName] = useState("");
  const [initialFullName, setInitialFullName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const {
    profileLoading,
    passwordLoading,
    profileError,
    passwordError,
    profileSuccess,
    passwordSuccess,
    updateProfile,
    updatePassword,
    resetProfileStatus,
    resetPasswordStatus,
  } = useSettings();

 
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (data?.full_name) {
        setFullName(data.full_name);
        setInitialFullName(data.full_name);
      }
    }
    loadUser();
  }, []);



  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await updateProfile({ full_name: fullName });
    if (ok) setInitialFullName(fullName);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setConfirmError(null);

    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords don't match.");
      return;
    }
    if (newPassword.length < 6) {
      setConfirmError("New password must be at least 6 characters.");
      return;
    }

    const ok = await updatePassword({ currentPassword, newPassword });
    if (ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  const profileDirty = fullName !== initialFullName;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account details and security.
        </p>
      </div>

      <Separator />

      {/* ── Profile Section ── */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  resetProfileStatus();
                }}
                placeholder="Your full name"
                disabled={profileLoading}
              />
            </div>

            {profileError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{profileError}</AlertDescription>
              </Alert>
            )}

            {profileSuccess && (
              <Alert className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Name updated successfully.</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={profileLoading || !profileDirty || !fullName.trim()}
            >
              {profileLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Password Section ── */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            You&apos;ll need to verify your current password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  resetPasswordStatus();
                }}
                placeholder="••••••••"
                disabled={passwordLoading}
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setConfirmError(null);
                  resetPasswordStatus();
                }}
                placeholder="••••••••"
                disabled={passwordLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmError(null);
                }}
                placeholder="••••••••"
                disabled={passwordLoading}
                autoComplete="new-password"
              />
            </div>

            {(confirmError || passwordError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {confirmError ?? passwordError}
                </AlertDescription>
              </Alert>
            )}

            {passwordSuccess && (
              <Alert className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Password updated successfully.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={
                passwordLoading ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
            >
              {passwordLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
