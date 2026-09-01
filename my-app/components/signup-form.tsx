"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/router";
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
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";
import { handleSocialLogin } from "@/lib/social-login";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      setError("Full Name is required.");
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name: cleanName,
      email: cleanEmail,
      password,
      callbackURL: "/dashboard",
    });

    if (signUpError) {
      setError(signUpError.message || "Unable to create account.");
      setLoading(false);
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(cleanEmail)}`);
  };

  const onSocialLogin = async (provider: "google" | "github") => {
    try {
      setLoading(true);
      setError("");

      await handleSocialLogin(provider);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Social login failed.");

      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                >
                  {showPassword ? (
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
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <div className="relative w-full">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            {/* Error Display */}
            {error && (
              <Field>
                <FieldError>{error}</FieldError>
              </Field>
            )}

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={loading}
                    className="w-full"
                    onClick={() => onSocialLogin("google")}
                  >
                    Sign up with Google
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    disabled={loading}
                    className="w-full"
                    onClick={() => onSocialLogin("github")}
                  >
                    Sign up with GitHub
                  </Button>
                </div>
                <FieldDescription className="px-6 text-center mt-3">
                  Already have an account? {""}{" "}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
