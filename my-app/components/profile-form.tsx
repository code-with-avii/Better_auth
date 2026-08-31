"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { User, KeyRound, Eye, EyeOff } from "lucide-react";

interface ProfileFormProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
  };
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  // Profile Update State
  const [name, setName] = useState(initialUser.name);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess(false);

    const cleanName = name.trim();

    if (!cleanName) {
      setProfileError("Name cannot be empty.");
      setProfileLoading(false);
      return;
    }

    try {
      const { error } = await authClient.updateUser({
        name: cleanName,
      });

      if (error) {
        setProfileError(error.message || "Failed to update profile name.");
        setProfileLoading(false);
        return;
      }

      setProfileSuccess(true);
      setProfileLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setProfileError(message);
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Current password is required.");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setPasswordError(error.message || "Failed to update password. Check your current password.");
        setPasswordLoading(false);
        return;
      }

      setPasswordSuccess(true);
      setPasswordLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setPasswordError(message);
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Update Profile Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-zinc-500" />
            General Information
          </CardTitle>
          <CardDescription>Update your personal account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="profile-email">Email Address</FieldLabel>
                <Input
                  id="profile-email"
                  type="email"
                  value={initialUser.email}
                  disabled
                  className="bg-zinc-100/50 dark:bg-zinc-900/50"
                />
                <FieldDescription>
                  Your email address cannot be changed.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="profile-name">Full Name</FieldLabel>
                <Input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileLoading}
                  placeholder="John Doe"
                  required
                />
              </Field>

              {profileError && (
                <Field>
                  <FieldError>{profileError}</FieldError>
                </Field>
              )}

              {profileSuccess && (
                <Field>
                  <div className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-250 p-2.5 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800">
                    Profile settings successfully updated.
                  </div>
                </Field>
              )}

              <Field>
                <Button type="submit" disabled={profileLoading} className="w-fit">
                  {profileLoading ? "Saving..." : "Save Changes"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-zinc-500" />
            Update Password
          </CardTitle>
          <CardDescription>Configure a new secure password for your login credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
                <div className="relative w-full">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                <div className="relative w-full">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={passwordLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-new-password">Confirm New Password</FieldLabel>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  disabled={passwordLoading}
                />
              </Field>

              {passwordError && (
                <Field>
                  <FieldError>{passwordError}</FieldError>
                </Field>
              )}

              {passwordSuccess && (
                <Field>
                  <div className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-250 p-2.5 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800">
                    Password changed successfully! Active sessions on other devices have been revoked.
                  </div>
                </Field>
              )}

              <Field>
                <Button type="submit" disabled={passwordLoading} className="w-fit">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
