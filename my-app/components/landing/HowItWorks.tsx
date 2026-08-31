import {
  Check,
  Lock,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create an account",
    description:
      "Sign up securely with your email and password.",
  },
  {
    number: "02",
    icon: Lock,
    title: "Authenticate",
    description:
      "Sign in and securely authenticate your identity.",
  },
  {
    number: "03",
    icon: Check,
    title: "Access your dashboard",
    description:
      "Access protected features and manage your account.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>

          <p className="mt-4 text-slate-600">
            Get started in just a few simple steps.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600">
                  <Icon size={25} />
                </div>

                <p className="text-sm font-bold text-indigo-600">
                  {step.number}
                </p>

                <h3 className="mt-2 font-semibold">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}