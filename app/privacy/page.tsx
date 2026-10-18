import type { Metadata } from "next";
import Reveal, { Rule } from "@/components/Reveal";
import { site, hosting, authorProfile, authorSocialLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Choufli Mosta9bel collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

export default function PrivacyPage() {
  const updated = "18 October 2026";

  return (
    <>
      <section className="bg-bg pt-36 pb-10 sm:pt-44">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">Legal</p>
            <h1 className="mt-3 text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              Privacy Policy
            </h1>
            <p className="mt-4 text-[16px] text-gray-2">Last updated: {updated}</p>
          </Reveal>
          <Rule className="mt-8" />
        </div>
      </section>

      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="space-y-10 text-[17px] leading-relaxed text-gray-2">
            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  The short version
                </h2>
                <p className="mt-3">
                  {site.name} is a free, public information site. We do not sell
                  your data, we do not run advertising, and we do not track you
                  across other websites. There is no account to create.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  What we collect
                </h2>
                <p className="mt-3">
                  When you use the orientation score calculator, everything you
                  type is processed entirely in your browser. Your marks are
                  never transmitted to our servers and are never stored.
                </p>
                <p className="mt-3">
                  If you send us a message through the contact form, we receive
                  the name, email address and message you choose to provide, so
                  that we can reply to you.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Language preference
                </h2>
                <p className="mt-3">
                  We store your language choice (English, French or Arabic) in
                  your browser&apos;s local storage so the site remembers it on
                  your next visit. This never leaves your device.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Cookies and analytics
                </h2>
                <p className="mt-3">
                  We set no advertising or tracking cookies. If privacy-respecting
                  analytics are used in future, they will be aggregate-only and
                  this policy will be updated before they are enabled.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Third-party links
                </h2>
                <p className="mt-3">
                  We link to official Tunisian government sites such as the
                  orientation portal. Once you follow a link, that site governs
                  your data. We have no control over it.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Your rights
                </h2>
                <p className="mt-3">
                  You can ask us at any time to show, correct or delete the data
                  we hold about you, or to withdraw a message you sent. Write
                  to{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-blue underline underline-offset-2"
                  >
                    {site.email}
                  </a>
                  .
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Accuracy of information
                </h2>
                <p className="mt-3">
                  The orientation calculator implements the formula published by
                  the Tunisian Ministry of Higher Education. It is a reference
                  tool, not an official one. Always confirm your final score on
                  the official orientation portal.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Publisher
                </h2>
                <p className="mt-3">
                  This site is published by{" "}
                  <a
                    href={authorProfile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue underline underline-offset-2"
                  >
                    {authorProfile.name}
                  </a>{" "}
                  ({authorProfile.role}).
                </p>
                <p className="mt-3">
                  Publisher contact:{" "}
                  {authorProfile.email && (
                    <>
                      <a
                        href={`mailto:${authorProfile.email}`}
                        className="text-blue underline underline-offset-2"
                      >
                        {authorProfile.email}
                      </a>
                      ,{" "}
                    </>
                  )}
                  {authorProfile.phone && (
                    <a
                      href={`tel:${authorProfile.phone.replace(/\s/g, "")}`}
                      className="text-blue underline underline-offset-2"
                    >
                      {authorProfile.phone}
                    </a>
                  )}
                  {authorProfile.location && <> &middot; {authorProfile.location}</>}
                </p>
                {authorSocialLinks.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {authorSocialLinks.map((s) => (
                      <a
                        key={s.network}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="text-blue underline underline-offset-2"
                      >
                        {s.network}
                      </a>
                    ))}
                  </p>
                )}
                <p className="mt-3">
                  Hosting is provided by{" "}
                  <a
                    href={hosting.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue underline underline-offset-2"
                  >
                    {hosting.domain}
                  </a>{" "}
                  ({hosting.city}, {hosting.countryCode}).
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
