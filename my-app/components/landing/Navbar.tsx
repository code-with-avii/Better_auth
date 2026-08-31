import Link from "next/link";

import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <ShieldCheck size={21} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            AuthFlow
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            Features
          </a>

          <a
            href="#security"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            Security
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100 sm:block"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}