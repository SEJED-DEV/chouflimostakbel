"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "@phosphor-icons/react/dist/ssr/House";
import { Signpost } from "@phosphor-icons/react/dist/ssr/Signpost";
import { Books } from "@phosphor-icons/react/dist/ssr/Books";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { MailIcon, InfoIcon } from "./SiteIcons";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home", Icon: House },
  { href: "/dropouts", label: "Dropouts", Icon: Signpost },
  { href: "/divisions", label: "Divisions", Icon: Books },
  { href: "/graduates", label: "Graduates", Icon: GraduationCap },
];

/**
 * Desktop: a floating frosted capsule with links. Mobile: the capsule shows
 * only the logo, and navigation moves to an iOS-style bottom tab bar -
 * frosted, safe-area aware, blue active state.
 */
export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Top capsule */}
      <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav
          aria-label="Main"
          className="frosted mx-auto flex max-w-5xl items-center justify-between rounded-full py-2 pl-4 pr-2"
          style={{
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(255,255,255,0.6)",
          }}
        >
          <Link
            href="/"
            aria-label="Choufli Mosta9bel, home"
            className="flex items-center gap-2.5"
          >
            <Logo className="h-7" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
              Choufli Mosta9bel
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 ${
                    active ? "bg-ink/[0.06] text-ink" : "text-gray-2 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/about"
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 ${
                pathname === "/about"
                  ? "bg-ink/[0.06] text-ink"
                  : "text-gray-2 hover:text-ink"
              }`}
            >
              About
            </Link>
            <Link
              href="/dropouts"
              className="ml-2 rounded-full bg-blue px-4 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-hi"
            >
              Get started
            </Link>
          </div>

          {/* Small-screen utilities: info + contact */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/about"
              aria-label="About us"
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                pathname === "/about" ? "bg-ink/[0.06] text-ink" : "text-gray-2"
              }`}
            >
              <InfoIcon size={20} />
            </Link>
            <Link
              href="/about#contact"
              aria-label="Contact us"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-2 transition-colors"
            >
              <MailIcon size={20} />
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom tab bar - mobile only, iOS-style */}
      <nav
        aria-label="Primary"
        className="frosted fixed inset-x-0 bottom-0 z-50 flex items-stretch justify-around border-t border-black/[0.07] pb-[env(safe-area-inset-bottom)] md:hidden"
        style={{ boxShadow: "0 -1px 20px rgba(0,0,0,0.06)" }}
      >
        {links.map((l) => {
          const active = pathname === l.href;
          const { Icon } = l;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5"
            >
              <Icon
                size={24}
                weight={active ? "fill" : "regular"}
                className={active ? "text-blue" : "text-gray"}
              />
              <span
                className={`text-[11px] leading-none ${
                  active ? "font-medium text-blue" : "text-gray"
                }`}
              >
                {l.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
