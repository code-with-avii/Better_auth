import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth.api.getSession({
    headers: new Headers(context.req.headers as unknown as Record<string, string>),
  });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialSession: JSON.parse(JSON.stringify(session)),
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
}

export default function Dashboard({ initialSession }: DashboardProps) {
  const router = useRouter();
  const { data: sessionData } = authClient.useSession();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const user = sessionData?.user || initialSession.user;
  const session = sessionData?.session || initialSession.session;

  if (!user || !session) {
    return null;
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
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      {/* Premium Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                A
              </div>
              <span className="text-lg tracking-tight font-bold">Acme Auth</span>
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-primary bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md"
              >
                Dashboard
              </Link>
              {/* <Link
                href="/profile"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 px-3 py-1.5 transition-colors"
              >
                Profile Settings
              </Link> */}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {getInitials(user.name)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={loggingOut}
              onClick={handleLogout}
              className="text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section with Backdrop Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-lineart-to-r from-zinc-900 to-zinc-850 p-6 text-black shadow-xl dark:from-zinc-900 dark:to-zinc-900/50 dark:border dark:border-zinc-800/60 sm:p-8 mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
                Welcome back, {user.name}!
              </h1>
              <p className="mt-2 text-gray-900 max-w-2xl">
                Manage your credentials, monitor active sessions, and configure profile parameters in Acme&apos;s secure authentication client portal.
              </p>
            </div>
            {/* <div className="flex gap-3">
              <Link href="/profile">
                <Button className="bg-white text-zinc-950 hover:bg-zinc-100 flex items-center gap-2">
                  <Settings className="size-4" />
                  Account Settings
                </Button>
              </Link>
            </div> */}
          </div>
          {/* Subtle grid backdrop decoration */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* User Profile Overview */}
          <Card className="md:col-span-1 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-zinc-500" />
                Profile Identity
              </CardTitle>
              <CardDescription>Verified account credentials</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4 p-3 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">{user.name}</h3>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">UUID: {user.id}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Mail className="h-4 w-4" />
                    <span>Email address</span>
                  </div>
                  <span className="font-medium text-right truncate max-w-45">{user.email}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Email status</span>
                  </div>
                  {user.emailVerified ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-600/10">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 ring-1 ring-amber-600/10">
                      Unverified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-4 w-4" />
                    <span>Registered</span>
                  </div>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Security Session Details */}
          <Card className="md:col-span-2 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Security & Session State
              </CardTitle>
              <CardDescription>Real-time login session tracking details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl">
                  <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                    <Laptop className="h-5 w-5 text-zinc-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Device User Agent</h4>
                    <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200 wrap-break leading-relaxed max-w-70">
                      {session.userAgent || "Desktop Browser"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl">
                  <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                    <Globe className="h-5 w-5 text-zinc-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">IP Address</h4>
                    <p className="mt-1 text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                      {session.ipAddress || "127.0.0.1"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm mt-2">
                <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Activity className="h-4 w-4" />
                    <span>Session Token</span>
                  </div>
                  <span className="font-mono text-xs max-w-50 truncate select-all px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400">
                    {session.token}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Revoke Status</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 font-medium">
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
