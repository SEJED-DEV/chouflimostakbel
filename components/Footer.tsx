"use client";

import Link from "next/link";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import DownloadButton from "./DownloadButton";
import PushPrompt from "./PushPrompt";
import EmailOff from "./EmailOff";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { site, socialLinks, REPO_URL } from "@/lib/site";
import { useT } from "./LanguageProvider";

export default function Footer() {
  const { t } = useT();

  const links = [
    { href: "/", key: "home" },
    { href: "/dropouts", key: "dropouts" },
    { href: "/divisions", key: "divisions" },
    { href: "/graduates", key: "graduates" },
  ] as const;

  const legalLinks = [
    { href: "/privacy", key: "privacyTitle" },
    { href: "/terms", key: "termsTitle" },
  ] as const;

  return (
    <footer className="bg-bg-alt">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo className="h-9" />
            <p className="mt-5 text-[15px] leading-relaxed text-gray-2">
              {t.footer.blurb}
            </p>

            {socialLinks.length > 0 && (
              <SocialLinks
                links={socialLinks}
                className="mt-6"
                buttonClassName="flex h-9 w-9 items-center justify-center rounded-full bg-bg text-gray-2 transition-all duration-200 hover:text-ink active:scale-95"
              />
            )}

            <DownloadButton variant="pill" className="mt-6" />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <nav aria-label="Footer">
              <p className="text-[13px] font-semibold text-ink">
                {t.footer.explore}
              </p>
              <ul className="mt-4 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-gray-2 transition-colors hover:text-blue"
                    >
                      {t.nav[l.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-[13px] font-semibold text-ink">
                {t.footer.contact}
              </p>
              <EmailOff>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 block text-[14px] break-all text-gray-2 transition-colors hover:text-blue"
                >
                  {site.email}
                </a>
              </EmailOff>
            </div>

            <div>
              <p className="text-[13px] font-semibold text-ink">
                {t.footer.legal}
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/soon"
                    className="text-[14px] text-gray-2 transition-colors hover:text-blue"
                  >
                    {t.footer.soon}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-[14px] text-gray-2 transition-colors hover:text-blue"
                  >
                    {t.footer.changelog}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-[14px] text-gray-2 transition-colors hover:text-blue"
                  >
                    {t.nav.profile}
                  </Link>
                </li>
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-gray-2 transition-colors hover:text-blue"
                    >
                      {t.legal[l.key]}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-gray-2 transition-colors hover:text-blue"
                  >
                    {t.footer.contribute}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* On a phone there is no top bar, so the language and theme controls
            live here instead. */}
        <div className="mt-10 flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <PushPrompt className="mt-12" />

        <div className="mt-14 border-t border-sep pt-6">
          <p className="text-[13px] text-gray">
            {t.footer.rights.copyright}{" "}
            <span className="font-semibold text-ink">{t.footer.rights.brand}</span>.{" "}
            {t.footer.rights.made}
          </p>
        </div>
      </div>
    </footer>
  );
}
