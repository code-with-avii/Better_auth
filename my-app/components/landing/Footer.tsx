import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Features", "Security", "Roadmap"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Guides", "API Reference"],
  },
  {
    title: "Company",
    links: ["About", "Privacy", "Terms"],
  },
];


export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShieldCheck size={21} />
              </div>

              <span className="text-xl font-bold">
                AuthFlow
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Simple, secure and modern authentication for your
              web applications.
            </p>

            {/* <div className="mt-5">
              <Github
                size={20}
                className="text-slate-500 hover:text-slate-900"
              />
            </div> */}
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">
                {column.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-900"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-slate-500">
          © 2026 AuthFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}