import type { Metadata } from "next";
import Reveal, { Rule } from "@/components/Reveal";
import { site } from "@/lib/site";
import Publisher from "@/components/Publisher";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Choufli Mosta9bel website.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

export default function TermsPage() {
  const updated = "18 October 2026";

  return (
    <>
      <section className="bg-bg pt-36 pb-10 sm:pt-44">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">Legal</p>
            <h1 className="mt-3 text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              Terms of Service
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
                  Acceptance
                </h2>
                <p className="mt-3">
                  By using {site.name} you agree to these terms. If you do not
                  agree, please stop using the site.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  What this site is for
                </h2>
                <p className="mt-3">
                  {site.name} is a free educational guidance resource for
                  Tunisian students. It publishes information about vocational
                  training, high school divisions and university orientation.
                </p>
                <p className="mt-3">
                  It is an independent project. It is not affiliated with,
                  endorsed by, or operated on behalf of the Tunisian Ministry of
                  Education or the Ministry of Higher Education.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Not official guidance
                </h2>
                <p className="mt-3">
                  The orientation score calculator is a reference tool built
                  from the Ministry&apos;s published formula. It is not an
                  official calculator, and its output has no legal or
                  administrative value.
                </p>
                <p className="mt-3">
                  Admission decisions rest entirely with the Ministry and the
                  official orientation portal. Nothing on this site constitutes
                  an admission offer, a guarantee of placement, or professional
                  academic advice. Always verify on{" "}
                  <a
                    href="https://www.orientation.tn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue underline underline-offset-2"
                  >
                    orientation.tn
                  </a>
                  .
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Changing the information
                </h2>
                <p className="mt-3">
                  Programmes, coefficients, thresholds and admission rules change
                  every academic year. We update this site as information becomes
                  available, but we cannot guarantee that every detail is current
                  at the moment you read it.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Acceptable use
                </h2>
                <p className="mt-3">
                  You may read, share and link to our content for personal,
                  educational use. You may not:
                </p>
                <ul className="mt-3 list-disc space-y-2 ps-5">
                  <li>present our content as your own;</li>
                  <li>use the site for commercial resale;</li>
                  <li>
                    attempt to disrupt, overload or gain unauthorised access to
                    the site.
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Limitation of liability
                </h2>
                <p className="mt-3">
                  The site is provided &quot;as is&quot;. To the fullest extent
                  permitted by law we are not liable for any loss arising from
                  reliance on the information published here, including
                  admission outcomes.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Contact
                </h2>
                <p className="mt-3">
                  Questions about these terms:{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-blue underline underline-offset-2"
                  >
                    {site.email}
                  </a>
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  Publisher
                </h2>
                <p className="mt-3">
                  {site.name} is published and maintained by the person below,
                  who can be reached directly with any question about these terms.
                </p>
                <div className="mt-5">
                  <Publisher />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
