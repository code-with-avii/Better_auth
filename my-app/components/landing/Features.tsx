import {
  Lock,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "Secure password handling and session management for your users.",
  },
  {
    icon: Zap,
    title: "Fast & Modern",
    description:
      "Built with modern web technologies for a fast user experience.",
  },
  {
    icon: Lock,
    title: "Protected Routes",
    description:
      "Protect your pages and APIs with reliable authentication.",
  },
  {
    icon: User,
    title: "User Management",
    description:
      "Manage user profiles, sessions, and account settings.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="border-t bg-muted/30 py-24"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary">
            Features
          </Badge>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for authentication
          </h2>

          <p className="mt-4 text-muted-foreground">
            A clean authentication experience without
            unnecessary complexity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={22} />
                  </div>

                  <CardTitle className="text-lg">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}