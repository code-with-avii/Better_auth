import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_40%)]" />

      <div className="container mx-auto grid min-h-162.5 items-center gap-16 px-6 py-20 lg:grid-cols-2">
        <div>
          <Badge variant="secondary" className="mb-6">
            ✨ Built for modern web applications
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Authentication
            <br />
            that{" "}
            <span className="text-primary">
              just works.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Secure, modern authentication for your web
            applications. Simple for users and powerful for
            developers.
          </p>

          <div className="mt-8 flex gap-3">
            <Button size="lg">
              <Link href="/signup">
                Get Started
                <ArrowRight />
              </Link>
            </Button>

            <Button size="lg" variant="outline">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Auth preview */}
        <Card className="mx-auto w-full max-w-md shadow-2xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold">
              Welcome back 👋
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account
            </p>

            <div className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email
                </label>

                <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
                  you@example.com
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Password
                </label>

                <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-muted-foreground">
                  <span>••••••••••</span>
                  <Lock size={16} />
                </div>
              </div>

              <Button className="w-full">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}