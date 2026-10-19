"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Bell } from "@phosphor-icons/react/dist/ssr/Bell";
import SocialLinks from "./SocialLinks";
import { socialLinks, site, isLiveHost } from "@/lib/site";
import { useT } from "./LanguageProvider";

type Status = "idle" | "sending" | "sent" | "error" | "tooMany" | "unavailable";

/**
 * Overrides the domain check.
 *
 *   always  the form is open everywhere - use it to test the real thing
 *   never   the form is closed everywhere
 *
 * Unset, the form opens only on the project's own domains.
 */
const OVERRIDE = process.env.NEXT_PUBLIC_CONTACT_FORM;

export default function Contact({
  title,
  note,
  className = "",
  headingLevel = "h2",
}: {
  title?: string;
  note?: string;
  className?: string;
  /**
   * The heading tag. A section inside a page is an h2; a page of its own is
   * an h1, and it should not be the only h2 on the page.
   */
  headingLevel?: "h1" | "h2";
}) {
  const { t } = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const heading = title ?? t.contact.title;
  const sub = note ?? t.contact.note;
  const Heading = headingLevel;

  // The form opens itself on the project's own domains and stays closed
  // everywhere else, so a preview build never collects messages it cannot
  // deliver. The closed state is what the server renders, so there is no
  // hydration mismatch and nothing flashes.
  useEffect(() => {
    if (OVERRIDE === "always") {
      setOpen(true);
      return;
    }
    if (OVERRIDE === "never") {
      setOpen(false);
      return;
    }
    setOpen(isLiveHost(window.location.hostname));
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const data = new FormData(event.currentTarget);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          // Bots fill every field they find. People never see this one.
          website: data.get("website"),
        }),
      });

      if (res.ok) {
        setStatus("sent");
        formRef.current?.reset();
        return;
      }

      const body = await res.json().catch(() => ({}));
      if (res.status === 429) setStatus("tooMany");
      else if (res.status === 503 || body.unavailable) setStatus("unavailable");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const problem =
    status === "tooMany"
      ? { title: t.contact.tooManyTitle, body: t.contact.tooManyBody }
      : status === "unavailable"
        ? { title: t.contact.unavailableTitle, body: t.contact.unavailableBody }
        : status === "error"
          ? { title: t.contact.errorTitle, body: t.contact.errorBody }
          : null;

  return (
    <section className={`bg-bg ${className}`}>
      <div className="mx-auto max-w-2xl px-6 py-24 sm:px-8">
        <div className="text-center">
          <Heading className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.03em] text-ink">
            {heading}
          </Heading>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-gray-2">
            {sub}
          </p>
        </div>

        {/* Social links */}
        <SocialLinks links={socialLinks} className="mt-7 justify-center" />

        <div className="mt-10">
          {!open ? (
            /* The form is closed until the site runs on its own domain. */
            <div className="card-soft rounded-3xl bg-bg p-8 text-center sm:p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-alt text-blue">
                <Bell size={22} weight="regular" />
              </div>
              <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-ink">
                {t.contact.comingSoonTitle}
              </h3>
              <p className="mx-auto mt-2.5 max-w-md text-[16px] leading-relaxed text-gray-2">
                {t.contact.comingSoonBody}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-[16px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-colors duration-300 hover:bg-blue-hi"
              >
                {t.contact.emailUs}
                <ArrowRight size={16} weight="bold" />
              </a>
              <p className="mt-4 font-mono text-[12.5px] text-gray">{site.email}</p>
            </div>
          ) : status === "sent" ? (
            <div className="card-soft flex flex-col items-center rounded-3xl bg-bg p-10 text-center">
              <CheckCircle size={44} weight="fill" className="text-blue" />
              <p className="mt-5 text-[22px] font-semibold text-ink">{t.contact.sentTitle}</p>
              <p className="mt-2 text-[16px] text-gray-2">{t.contact.sentBody}</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-7 rounded-full bg-bg-alt px-6 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-sep/60"
              >
                {t.contact.sendAnother}
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="card-soft rounded-3xl bg-bg p-7 sm:p-9"
            >
              {/* Says what went wrong instead of only turning red. */}
              {problem && (
                <div
                  role="alert"
                  className="mb-6 flex gap-3 rounded-2xl bg-bg-alt p-4 text-start"
                >
                  <WarningCircle
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-blue"
                  />
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{problem.title}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-gray-2">
                      {problem.body}{" "}
                      <a
                        href={`mailto:${site.email}`}
                        className="font-medium text-blue hover:underline"
                      >
                        {t.contact.emailUs}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-gray-2">
                    {t.contact.name}
                  </span>
                  <input
                    required
                    name="name"
                    type="text"
                    maxLength={80}
                    placeholder={t.contact.namePlaceholder}
                    className="input-ios"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-gray-2">
                    {t.contact.email}
                  </span>
                  <input
                    required
                    name="email"
                    type="email"
                    maxLength={200}
                    placeholder={t.contact.emailPlaceholder}
                    className="input-ios"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-[13px] font-medium text-gray-2">
                  {t.contact.message}
                </span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  maxLength={4000}
                  placeholder={t.contact.messagePlaceholder}
                  className="input-ios resize-none"
                />
              </label>

              {/* Honeypot: positioned off-screen, not display:none, so it is
                  still submitted by anything that fills in every field. */}
              <label className="absolute start-[-9999px] top-0" aria-hidden="true">
                <span>Website</span>
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 text-[17px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi disabled:cursor-default disabled:opacity-60 sm:w-auto"
              >
                {status === "sending" ? t.contact.sending : t.contact.send}
                {status !== "sending" && (
                  <ArrowRight
                    size={17}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
