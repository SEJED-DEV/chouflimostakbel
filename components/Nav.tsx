"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "@phosphor-icons/react/dist/ssr/House";
import { Signpost } from "@phosphor-icons/react/dist/ssr/Signpost";
import { Books } from "@phosphor-icons/react/dist/ssr/Books";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { Newspaper } from "@phosphor-icons/react/dist/ssr/Newspaper";
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle";
import { User } from "@phosphor-icons/react/dist/ssr/User";
import { MailIcon, InfoIcon } from "./SiteIcons";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import DownloadButton from "./DownloadButton";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

/**
 * The guides - the three audiences the site is for.
 */
const guides = [
  { href: "/dropouts", labelKey: "dropouts", Icon: Signpost },
  { href: "/divisions", labelKey: "divisions", Icon: Books },
  { href: "/graduates", labelKey: "graduates", Icon: GraduationCap },
] as const;

/**
 * The bottom tab bar, and the part of the desktop navigation that matters.
 *
 * On a phone there is no top bar at all - the tab bar is the navigation. That
 * is why the account lives in the tab bar and not in a capsule that is not
 * there.
 */
const tabs = [
  { href: "/", labelKey: "home", Icon: House },
  ...guides,
  { href: "/blogs", labelKey: "blogs", Icon: Newspaper },
  { href: "/profile", labelKey: "profile", Icon: UserCircle },
] as const;

/**
 * Desktop: a floating frosted capsule with links.
 *
 * Mobile: no capsule. The iOS-style bottom tab bar takes over, and the
 * language and theme controls move into the footer, where they are still
 * reachable.
 */
export default function Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { profile } = useAuth();

  return (
    <>
      {/* Top capsule - desktop only */}
      <div className="fixed inset-x-0 top-0 z-50 hidden px-4 pt-4 md:block">
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

          <div className="flex items-center gap-1">
            {tabs.slice(0, 4).map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 ${
                    active ? "bg-ink/[0.06] text-ink" : "text-gray-2 hover:text-ink"
                  }`}
                >
                  {t.nav[l.labelKey]}
                </Link>
              );
            })}
            <Link
              href="/blogs"
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 ${
                pathname === "/blogs" ? "bg-ink/[0.06] text-ink" : "text-gray-2 hover:text-ink"
              }`}
            >
              {t.nav.blogs}
            </Link>
            <Link
              href="/about"
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 ${
                pathname === "/about" ? "bg-ink/[0.06] text-ink" : "text-gray-2 hover:text-ink"
              }`}
            >
              {t.nav.about}
            </Link>

            {/* The blue action becomes the account: a name when signed in,
                and a way in when not. */}
            {profile ? (
              <Link
                href="/profile"
                className="ml-2 inline-flex max-w-[11rem] items-center gap-1.5 rounded-full bg-blue px-4 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-hi"
              >
                <User size={16} weight="bold" />
                <span className="truncate">{profile.displayName}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="ml-2 rounded-full bg-blue px-4 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-hi"
              >
                {t.nav.login}
              </Link>
            )}

            <div className="ms-1 flex items-center border-s border-sep ps-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom tab bar - the only navigation on a phone */}
      <nav
        aria-label="Primary"
        className="frosted fixed inset-x-0 bottom-0 z-50 flex items-stretch justify-around border-t border-black/[0.07] pb-[env(safe-area-inset-bottom)] md:hidden"
        style={{ boxShadow: "0 -1px 20px rgba(0,0,0,0.06)" }}
      >
        {tabs.map((l) => {
          const active = pathname === l.href;
          const { Icon } = l;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 py-2.5"
            >
              <Icon
                size={23}
                weight={active ? "fill" : "regular"}
                className={active ? "text-blue" : "text-gray"}
              />
              <span
                className={`max-w-full truncate text-[10.5px] leading-none ${
                  active ? "font-medium text-blue" : "text-gray"
                }`}
              >
                {t.nav[l.labelKey]}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
