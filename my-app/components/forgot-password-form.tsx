"use client";
import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { getUserFriendlyErrorMessage, logServerError } from "@/lib/errors";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email: cleanEmail,
        redirectTo: "/reset-password",
      });

      if (resetError) {
        logServerError("Request password reset", resetError);
        const friendlyMsg = getUserFriendlyErrorMessage(
          resetError,
          "Failed to send reset link. Please try again."
        );
        setError(friendlyMsg);
        toast.error(friendlyMsg);
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Password reset email sent! Check your inbox.");
      setLoading(false);
    } catch (err: unknown) {
      logServerError("Unexpected request password reset error", err);
      const friendlyMsg = getUserFriendlyErrorMessage(err);
      setError(friendlyMsg);
      toast.error(friendlyMsg);
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
                If an account exists for {email}, we&apos;ve sent a password reset link to your inbox.
              </div>
              <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading}
                  />
                </Field>

                {error && (
                  <Field>
                    <FieldError>{error}</FieldError>
                  </Field>
                )}

                <Field>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending link..." : "Send Reset Link"}
                  </Button>

                  <FieldDescription className="text-center mt-2">
                    Remember your password?{" "}
                    <Link href="/login" className="underline">
                      Login
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
