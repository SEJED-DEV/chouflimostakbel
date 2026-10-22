"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "./Icons";
import Logo from "./Logo";
import SettingsButton from "./SettingsSheet";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import AccountMenu from "./AccountMenu";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { isStaff, normaliseRoles } from "@/lib/roles";

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
 * On a phone there is no top bar of links at all - the tab bar is the
 * navigation. That is why the account lives in the tab bar and not in a
 * capsule that is not there.
 */
const tabs = [
  { href: "/", labelKey: "home", icon: "house" },
  ...guides,
  { href: "/community", labelKey: "blogs", icon: "newspaper" },
  { href: "/profile", labelKey: "profile", icon: "circle-user" },
] as const satisfies { href: string; labelKey: string; icon: IconName }[];

/**
 * Pages the top capsule stays off.
 *
 * Only the profile. It carries its own settings gear - the capsule's gear is
 * for every other page, and two gears in one corner is one too many.
 *
 * It used to also hide the capsule on the community index and the admin
 * panel, on the grounds that those pages want the full width. But the
 * capsule is `fixed`, so it is out of the flow and never took any width
 * from anything; what it actually did was take away the account button, the
 * theme, the language and the gear on the two pages a reader is most likely
 * to be reading. A reader who cannot find a gear cannot find a way out, so
 * "there is a way out" must not depend on which page you are standing on.
 *
 * The desktop capsule is unaffected - at that size there is no tab bar to
 * compete with.
 */
const CAPSULE_HIDDEN = ["/profile"];

/**
 * Desktop: a floating frosted capsule with links.
 *
 * On a phone the same capsule appears, but without the links - it carries the
 * account, the settings, the theme and the language, and the iOS-style bottom
 * tab bar underneath does the navigating. It stays off the pages in
 * `CAPSULE_HIDDEN`.
 *
 * WHAT WAS REWORKED
 *
 * The capsule used to carry the full wordmark, the account's name and three
 * icon buttons, and it did all of that on a 360-pixel phone, where the sum
 * of it is wider than the screen. So on a narrow screen the wordmark is gone
 * (the mark alone says who this is) and the account is the photograph alone
 * (the name is in the menu it opens, and the profile tab is two taps away).
 *
 * The tab labels scale with the viewport rather than sitting at a fixed
 * size, because a staff member's bar carries seven labels instead of six and
 * a fixed size that fits six does not fit seven on the narrowest phones.
 */
export default function Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { profile } = useAuth();
  const capsuleHidden = CAPSULE_HIDDEN.includes(pathname);

  const staff = isStaff(normaliseRoles(profile?.roles ?? []));

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
          className="frosted mx-auto flex max-w-5xl items-center justify-between rounded-full py-2 ps-4 pe-2"
          style={{
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(255,255,255,0.6)",
          }}
        >
          <Link
            href="/"
            aria-label="Choufli Mosta9bel, home"
            className="flex min-w-0 items-center gap-2.5"
          >
            <Logo className="h-7 shrink-0" />
            {/* The wordmark needs room the capsule does not have on a
                phone. The mark alone carries the name. */}
            <span className="hidden text-[15px] font-semibold tracking-[-0.02em] text-ink md:inline">
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
                href="/community"
                className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 ${
                  pathname === "/community" ? "bg-ink/[0.06] text-ink" : "text-gray-2 hover:text-ink"
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

            {/* The blue action becomes the account: the reader's own
                photograph, and a menu of what an account can do. */}
            {profile ? (
              <AccountMenu />
            ) : (
              <Link
                href="/login"
                className="ms-2 rounded-full bg-blue px-4 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-hi"
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
      <TabBar pathname={pathname} staff={staff} />
    </>
  );
}

/**
 * The bottom tab bar.
 *
 * Six destinations, and seven for staff, who also get the admin panel. The
 * labels scale with the viewport so that the seventh one fits on the
 * narrowest phones without the first six being squeezed to nothing.
 */
function TabBar({
  pathname,
  staff,
}: {
  pathname: string;
  staff: boolean;
}) {
  const { t } = useLanguage();

  const items = staff
    ? [
        ...tabs,
        { href: "/admin", labelKey: "admin", icon: "shield" as IconName },
      ]
    : tabs;

  return (
    <nav
      aria-label="Primary"
      className="frosted fixed inset-x-0 bottom-0 z-50 flex items-stretch justify-around border-t border-black/[0.07] pb-[env(safe-area-inset-bottom)] md:hidden"
      style={{ boxShadow: "0 -1px 20px rgba(0,0,0,0.06)" }}
    >
      {items.map((l) => {
        const active = pathname === l.href;
        const label = t.nav[l.labelKey as keyof typeof t.nav];
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 py-2.5"
          >
            <Icon
              name={l.icon}
              size={22}
              className={active ? "text-blue" : "text-gray"}
            />
            <span
              className={`max-w-full truncate leading-none ${
                active
                  ? "font-medium text-blue"
                  : "text-gray"
              } text-[clamp(9px,2.7vw,10.5px)]`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
