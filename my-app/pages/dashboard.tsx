import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  LogOut,
  Laptop,
  Globe,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { getUserFriendlyErrorMessage, logServerError } from "@/lib/errors";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(context.req.headers),
  });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const initialSession = JSON.parse(JSON.stringify(session));

  const registeredDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(session.user.createdAt));

  return {
    props: {
      initialSession,
      registeredDate,
    },
  };
};

interface DashboardProps {
  initialSession: {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      createdAt: string | Date;
    };
    session: {
      id: string;
      token: string;
      expiresAt: string | Date;
      userAgent?: string | null;
      ipAddress?: string | null;
    };
  };
  registeredDate: string;
}

export default function Dashboard({
  initialSession,
  registeredDate,
}: DashboardProps) {
  const router = useRouter();
  const toast = useToast();
  const { data: sessionData, isPending } = authClient.useSession();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully.");
            router.push("/login");
          },
          onError: (ctx) => {
            logServerError("Sign out error", ctx.error);
            const msg = getUserFriendlyErrorMessage(
              ctx.error,
              "Unable to sign out. Please try again."
            );
            toast.error(msg);
            setLoggingOut(false);
          },
        },
      });
    } catch (err: unknown) {
      logServerError("Unexpected sign out error", err);
      toast.error("Unable to sign out. Please try again.");
      setLoggingOut(false);
    }
  };

  const user = sessionData?.user || initialSession.user;
  const session = sessionData?.session || initialSession.session;

  if (isPending && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 text-center p-6">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-zinc-500">Loading your profile session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 text-center p-6">
          <CardHeader>
            <CardTitle>Session Not Available</CardTitle>
            <CardDescription>
              Your active session details could not be retrieved. Please sign in again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Premium Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                A
              </div>
              <span className="text-base font-bold tracking-tight sm:text-lg">
                Acme Auth
              </span>
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-primary dark:bg-zinc-800"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
              </div>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 sm:size-9 sm:text-sm dark:bg-zinc-800 dark:text-zinc-300">
                {getInitials(user.name)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={loggingOut}
              onClick={handleLogout}
              className="border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Welcome Section */}
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-zinc-900 to-zinc-800 p-5 text-white shadow-xl sm:mb-8 sm:p-8 dark:border dark:border-zinc-800/60 dark:from-zinc-900 dark:to-zinc-900/50">
          <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                Active Session
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-3xl">
                Welcome back, {user.name}!
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                Manage your credentials, monitor active sessions, and configure
                profile parameters in Acme&apos;s secure authentication client
                portal.
              </p>
            </div>
          </div>
          {/* Subtle grid backdrop decoration */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size[24px_24px] opacity-20" />
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* User Profile Overview */}
          <Card className="border-zinc-200 lg:col-span-1 dark:border-zinc-800">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <UserIcon className="h-5 w-5 text-zinc-500" />
                Profile Identity
              </CardTitle>
              <CardDescription>Verified account credentials</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4 rounded-xl bg-zinc-100/50 p-3 dark:bg-zinc-900/50">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">
                    {user.name}
                  </h3>
                  <p className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    UUID: {user.id}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1 border-b border-zinc-100 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>Email address</span>
                  </div>
                  <span className="truncate font-medium text-zinc-900 sm:text-right dark:text-zinc-100">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-100 py-2 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>Email status</span>
                  </div>
                  {user.emailVerified ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 ring-1 ring-emerald-600/10 dark:bg-emerald-950/20 dark:text-emerald-400">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 ring-1 ring-amber-600/10 dark:bg-amber-950/20 dark:text-amber-400">
                      Unverified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-b border-zinc-100 py-2 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Registered</span>
                  </div>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {registeredDate}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Security Session Details */}
          <Card className="border-zinc-200 lg:col-span-2 dark:border-zinc-800">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Security & Session State
              </CardTitle>
              <CardDescription>
                Real-time login session tracking details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-zinc-100/50 p-4 dark:bg-zinc-900/50">
                  <div className="shrink-0 rounded-lg border border-zinc-200/50 bg-white p-2 shadow-sm dark:border-zinc-700/50 dark:bg-zinc-800">
                    <Laptop className="h-5 w-5 text-zinc-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Device User Agent
                    </h4>
                    <p className="mt-1 wrap-break text-sm font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {session.userAgent || "Desktop Browser"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-zinc-100/50 p-4 dark:bg-zinc-900/50">
                  <div className="shrink-0 rounded-lg border border-zinc-200/50 bg-white p-2 shadow-sm dark:border-zinc-700/50 dark:bg-zinc-800">
                    <Globe className="h-5 w-5 text-zinc-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      IP Address
                    </h4>
                    <p className="mt-1 break-all font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {session.ipAddress || "127.0.0.1"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-3 text-sm">
                <div className="flex flex-col gap-1 border-b border-zinc-100 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Activity className="h-4 w-4 shrink-0" />
                    <span>Session Token</span>
                  </div>
                  <span className="select-all break-all rounded border border-zinc-200/50 bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600 sm:max-w-xs sm:truncate dark:border-zinc-800/50 dark:bg-zinc-900 dark:text-zinc-400">
                    {session.token}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-100 py-2.5 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>Revoke Status</span>
                  </div>
                  <span className="rounded border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                    Valid Session
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
