import Image from "next/image";
import SocialLinks from "./SocialLinks";
import { authorProfile, authorSocialLinks, hosting, site } from "@/lib/site";

/**
 * Publisher block for the legal notices.
 *
 * Everything here comes from `lib/site.ts`: the author details are synced
 * from sejed.dev (`npm run sync:site`), so a new profile added there flows
 * straight through to /privacy and /terms.
 */
export default function Publisher() {
  const telHref = `tel:${authorProfile.phone.replace(/\s/g, "")}`;

  return (
    <div className="rounded-2xl border border-sep/70 bg-bg-alt/50 p-6 sm:p-7">
      {/* Who publishes it */}
      <div className="flex items-start gap-4">
        {authorProfile.image && (
          <Image
            src={authorProfile.image}
            alt={authorProfile.name}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.10)" }}
          />
        )}

        <div className="min-w-0">
          <p className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
            <a
              href={authorProfile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-sep decoration-1 underline-offset-4 transition-colors hover:text-blue hover:decoration-blue"
            >
              {authorProfile.name}
            </a>
          </p>
          <p className="mt-0.5 text-[14px] text-gray-2">{authorProfile.role}</p>
          {authorProfile.location && (
            <p className="mt-0.5 text-[13px] text-gray">{authorProfile.location}</p>
          )}
        </div>
      </div>

      {/* How to reach them */}
      <dl className="mt-6 space-y-2.5 border-t border-sep pt-5 text-[14px]">
        {authorProfile.email && (
          <div className="flex flex-wrap items-baseline gap-x-2">
            <dt className="text-gray">Email</dt>
            <dd className="min-w-0">
              <a
                href={`mailto:${authorProfile.email}`}
                className="break-all text-ink underline decoration-sep underline-offset-4 transition-colors hover:text-blue"
              >
                {authorProfile.email}
              </a>
            </dd>
          </div>
        )}

        {authorProfile.phone && (
          <div className="flex flex-wrap items-baseline gap-x-2">
            <dt className="text-gray">Phone</dt>
            <dd>
              <a
                href={telHref}
                className="text-ink underline decoration-sep underline-offset-4 transition-colors hover:text-blue tabular-nums"
              >
                {authorProfile.phone}
              </a>
            </dd>
          </div>
        )}

        <div className="flex flex-wrap items-baseline gap-x-2">
          <dt className="text-gray">Project</dt>
          <dd>
            <a
              href={`mailto:${site.email}`}
              className="break-all text-ink underline decoration-sep underline-offset-4 transition-colors hover:text-blue"
            >
              {site.email}
            </a>
          </dd>
        </div>
      </dl>

      {/* Profiles */}
      {authorSocialLinks.length > 0 && (
        <div className="mt-6 border-t border-sep pt-5">
          <p className="text-[12px] font-semibold tracking-[0.06em] text-gray-2 uppercase">
            Elsewhere
          </p>
          <SocialLinks
            links={authorSocialLinks}
            className="mt-3"
            buttonClassName="flex h-9 w-9 items-center justify-center rounded-full bg-bg text-gray-2 transition-all duration-200 hover:text-ink active:scale-95"
          />
        </div>
      )}

      {/* Hosting */}
      <p className="mt-6 border-t border-sep pt-5 text-[13px] leading-relaxed text-gray">
        Hosted on {hosting.provider} infrastructure at{" "}
        <a
          href={hosting.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-2 underline underline-offset-4 transition-colors hover:text-blue"
        >
          {hosting.domain}
        </a>{" "}
        ({hosting.city}, {hosting.countryCode}).
      </p>
    </div>
  );
}
