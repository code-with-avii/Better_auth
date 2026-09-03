import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/toast";
import { getUserFriendlyErrorMessage, logServerError } from "@/lib/errors";

export default function VerifyEmail() {
  const router = useRouter();
  const toast = useToast();

  const email =
    typeof router.query.email === "string"
      ? router.query.email
      : "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resendVerificationEmail = async () => {
    if (!email) {
      setError("Please enter your email address to send a verification link.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error: sendError } = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/dashboard",
      });

      if (sendError) {
        logServerError("Resend verification email", sendError);
        const friendlyMsg = getUserFriendlyErrorMessage(
          sendError,
          "Failed to send verification email. Please try again."
        );
        setError(friendlyMsg);
        toast.error(friendlyMsg);
      } else {
        const successMsg = "Verification email sent successfully! Please check your inbox.";
        setMessage(successMsg);
        toast.success(successMsg);
      }
    } catch (err: unknown) {
      logServerError("Unexpected resend verification email error", err);
      const friendlyMsg = getUserFriendlyErrorMessage(err);
      setError(friendlyMsg);
      toast.error(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
      <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {email ? <Mail className="size-6" /> : <AlertCircle className="size-6 text-amber-500" />}
          </div>
          <CardTitle className="text-xl">Verify your email</CardTitle>

          <CardDescription>
            {email ? (
              <>
                We sent a verification link to
                <br />
                <strong className="text-zinc-900 dark:text-zinc-100">{email}</strong>
              </>
            ) : (
              "No email address specified for verification."
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {message && (
            <div className="p-3 text-sm text-center font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-center font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            onClick={resendVerificationEmail}
            disabled={loading || !email}
          >
            {loading ? "Sending link..." : "Resend verification email"}
          </Button>

          <div className="text-center text-sm text-muted-foreground pt-2">
            Already verified?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}