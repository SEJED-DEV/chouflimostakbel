import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/dropouts", label: "School Dropouts" },
  { href: "/divisions", label: "HS Divisions" },
  { href: "/graduates", label: "Graduates" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-alt">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo className="h-9" />
            <p className="mt-5 text-[15px] leading-relaxed text-gray-2">
              Real, practical paths to a stable future for Tunisian youth, with
              or without a Bac.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <nav aria-label="Footer">
              <p className="text-[13px] font-semibold text-ink">Explore</p>
              <ul className="mt-4 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-gray-2 transition-colors hover:text-blue"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-[13px] font-semibold text-ink">Contact</p>
              <a
                href="mailto:contact@chouflimostakbel.tn"
                className="mt-4 block text-[14px] text-gray-2 transition-colors hover:text-blue"
              >
                contact@chouflimostakbel.tn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-sep pt-6">
          <p className="text-[13px] text-gray">
            &copy; 2026 Choufli Mosta9bel. Made in Tunisia.
          </p>
        </div>
      </div>
    </footer>
  );
}
