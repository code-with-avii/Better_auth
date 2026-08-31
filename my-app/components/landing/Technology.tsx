const technologies = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Better Auth",
];

export default function Technology() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Technology
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Built with modern technology
        </h2>

        <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-4">
          {technologies.map((technology) => (
            <div
              key={technology}
              className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold shadow-sm"
            >
              {technology}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}