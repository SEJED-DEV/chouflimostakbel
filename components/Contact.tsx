"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { MailIcon } from "./SiteIcons";
import { socialLinks } from "@/lib/site";
import { useT } from "./LanguageProvider";

/** Brand marks for the social platforms we link out to. */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9Z" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  ),
  x: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.53 3h3.05l-6.67 7.62L21.75 21h-6.1l-4.78-6.26L5.4 21H2.34l7.13-8.15L2.25 3h6.26l4.32 5.7L17.53 3Zm-1.07 16.15h1.69L7.62 4.75H5.81l10.65 14.4Z" />
    </svg>
  ),
};

export default function Contact({
  title,
  note,
}: {
  title?: string;
  note?: string;
}) {
  const { t } = useT();
  const [sent, setSent] = useState(false);
  const heading = title ?? t.contact.title;
  const sub = note ?? t.contact.note;

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-2xl px-6 py-24 sm:px-8">
        <div className="text-center">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.03em] text-ink">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-gray-2">
            {sub}
          </p>
        </div>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="mt-7 flex items-center justify-center gap-2.5">
            {socialLinks.map((s) => (
              <a
                key={s.network}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={s.network}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-alt text-gray-2 transition-all duration-200 hover:bg-sep/60 hover:text-ink active:scale-95"
              >
                {SOCIAL_ICONS[s.network] ?? (
                  <MailIcon size={18} />
                )}
              </a>
            ))}
          </div>
        )}

        <div className="mt-10">
          {sent ? (
            <div className="card-soft flex flex-col items-center rounded-3xl bg-bg p-10 text-center">
              <CheckCircle size={44} weight="fill" className="text-blue" />
              <p className="mt-5 text-[22px] font-semibold text-ink">{t.contact.sentTitle}</p>
              <p className="mt-2 text-[16px] text-gray-2">{t.contact.sentBody}</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-7 rounded-full bg-bg-alt px-6 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-sep/60"
              >{t.contact.sendAnother}</button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="card-soft rounded-3xl bg-bg p-7 sm:p-9"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-gray-2">{t.contact.name}</span>
                  <input required type="text" placeholder={t.contact.namePlaceholder} className="input-ios" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-gray-2">{t.contact.email}</span>
                  <input required type="email" placeholder={t.contact.emailPlaceholder} className="input-ios" />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-[13px] font-medium text-gray-2">{t.contact.message}</span>
                <textarea
                  required
                  rows={4}
                  placeholder={t.contact.messagePlaceholder}
                  className="input-ios resize-none"
                />
              </label>
              <button
                type="submit"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 text-[17px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi sm:w-auto"
              >{t.contact.send}<ArrowRight
                  size={17}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
