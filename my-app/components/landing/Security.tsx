import { Check, ShieldCheck } from "lucide-react";

const securityFeatures = [
  "Secure password handling",
  "Session management",
  "Protected routes",
  "Server-side authentication",
  "Environment-based secrets",
  "Account management",
];

export default function Security() {
  return (
    <section
      id="security"
      className="border-y bg-slate-50 py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <ShieldCheck size={25} />
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Security without the complexity
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-slate-600">
            Authentication should be secure by default while remaining
            simple for developers to integrate and users to understand.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {securityFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check size={15} />
              </div>

              <span className="text-sm font-medium">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}