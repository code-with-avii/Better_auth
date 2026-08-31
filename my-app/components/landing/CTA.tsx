import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="about" className="px-6 pb-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 to-violet-600 px-8 py-12 text-white sm:px-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Ready to get started?
            </h2>

            <p className="mt-2 max-w-lg text-indigo-100">
              Create your account and experience a modern
              authentication flow.
            </p>
          </div>

          <Link
            href="/signup"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3.5 font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Create Account

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}