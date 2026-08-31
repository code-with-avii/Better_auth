import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { LogOut, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/profile-form";

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
      initialSession: session,
    },
  };
};

interface ProfilePageProps {
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

export default function ProfilePage({ initialSession }: ProfilePageProps) {
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

  if (!user) {
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
      {/* Navigation Header */}
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
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 px-3 py-1.5 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-primary bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md"
              >
                Profile Settings
              </Link>
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

      {/* Main Settings Portal */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-xl">
            <Settings className="size-6 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Account Configuration</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure security settings, profile parameters, and login credentials</p>
          </div>
        </div>

        {/* Profile and Password Form Wrapper */}
        <ProfileForm initialUser={user as { id: string; name: string; email: string; emailVerified: boolean }} />
      </main>
    </div>
  );
}
