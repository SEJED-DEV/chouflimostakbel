"use client";

import Link from "next/link";
import Logo from "./Logo";
import { site, socialLinks } from "@/lib/site";
import { useT } from "./LanguageProvider";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9Z" />
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  ),
  x: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.53 3h3.05l-6.67 7.62L21.75 21h-6.1l-4.78-6.26L5.4 21H2.34l7.13-8.15L2.25 3h6.26l4.32 5.7L17.53 3Zm-1.07 16.15h1.69L7.62 4.75H5.81l10.65 14.4Z" />
    </svg>
  ),
};

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
              <div className="mt-6 flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.network}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={s.network}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-bg text-gray-2 transition-all duration-200 hover:text-ink active:scale-95"
                  >
                    {SOCIAL_ICONS[s.network]}
                  </a>
                ))}
              </div>
            )}
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
              <a
                href={`mailto:${site.email}`}
                className="mt-4 block text-[14px] break-all text-gray-2 transition-colors hover:text-blue"
              >
                {site.email}
              </a>
            </div>

            <div>
              <p className="text-[13px] font-semibold text-ink">
                {t.footer.legal}
              </p>
              <ul className="mt-4 space-y-3">
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
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-sep pt-6">
          <p className="text-[13px] text-gray">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
