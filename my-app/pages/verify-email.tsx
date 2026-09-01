import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";

export default function VerifyEmail() {
  const router = useRouter();

  const email =
    typeof router.query.email === "string"
      ? router.query.email
      : "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resendVerificationEmail = async () => {
    if (!email) return;

    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(
        error.message || "Failed to send verification email."
      );
    } else {
      setMessage("Verification email sent!");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verify your email</CardTitle>

          <CardDescription>
            We sent a verification link to
            <br />
            <strong>{email}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {message && (
            <p className="text-center text-sm text-green-600">
              {message}
            </p>
          )}

          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <Button
            className="w-full"
            onClick={resendVerificationEmail}
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Resend verification email"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already verified?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}