"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "./Icons";
import Logo from "./Logo";
import SettingsButton from "./SettingsSheet";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

/**
 * The guides - the three audiences the site is for.
 */
const guides = [
  { href: "/dropouts", labelKey: "dropouts", icon: "signpost" },
  { href: "/divisions", labelKey: "divisions", icon: "books" },
  { href: "/graduates", labelKey: "graduates", icon: "graduation-cap" },
] as const satisfies { href: string; labelKey: string; icon: IconName }[];

/**
 * The bottom tab bar, and the part of the desktop navigation that matters.
 *
 * On a phone there is no top bar at all - the tab bar is the navigation. That
 * is why the account lives in the tab bar and not in a capsule that is not
 * there.
 */
const tabs = [
  { href: "/", labelKey: "home", icon: "house" },
  ...guides,
  { href: "/blogs", labelKey: "blogs", icon: "newspaper" },
  { href: "/profile", labelKey: "profile", icon: "circle-user" },
] as const satisfies { href: string; labelKey: string; icon: IconName }[];

/**
 * Pages the top capsule stays off.
 *
 * On a phone the capsule and the bottom tab bar are both navigation chrome,
 * and on these two pages the page itself is already carrying what the capsule
 * would: the profile has its own settings gear and its own banner, and the
 * blogs index wants the full width for the list. The desktop capsule is
 * unaffected - at that size there is no tab bar to compete with.
 */
const CAPSULE_HIDDEN = ["/blogs", "/profile"];

/**
 * Desktop: a floating frosted capsule with links.
 *
 * On a phone the same capsule appears, but without the links - it carries the
 * account, the settings, the theme and the language, and the iOS-style bottom
 * tab bar underneath does the navigating. It stays off the pages in
 * `CAPSULE_HIDDEN`.
 */
export default function Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { profile } = useAuth();
  const capsuleHidden = CAPSULE_HIDDEN.includes(pathname);

  return (
    <>
      {/* Top capsule - desktop only */}
      {/* On a phone the capsule carries the account, the settings and the
          theme; the links live in the tab bar below. It stands aside on the
          pages in CAPSULE_HIDDEN, where the page needs the whole width and
          already says - or carries - what the capsule would. */}
      <div
        className={
          "fixed inset-x-0 top-0 z-50 px-4 pt-4" +
          (capsuleHidden ? " hidden md:block" : "")
        }
      >
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
            {/* The links belong to the capsule only at the size where the
                bottom tab bar is not the navigation. */}
            <div className="hidden items-center gap-1 md:flex">
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
            </div>

            {/* The blue action becomes the account: a name when signed in,
                and a way in when not. */}
            {profile ? (
              <Link
                href="/profile"
                className="ml-2 inline-flex max-w-[11rem] items-center gap-1.5 rounded-full bg-blue px-4 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-hi"
              >
                <Icon name="user" size={16} />
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
              <SettingsButton />
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
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 py-2.5"
            >
              <Icon
                name={l.icon}
                size={23}
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
