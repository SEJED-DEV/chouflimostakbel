"use client";

/**
 * Exempts a piece of markup from Cloudflare's email obfuscation.
 *
 * Cloudflare's Scrape Shield rewrites email addresses in the HTML into
 * /cdn-cgi/l/email-protection links, which are decoded by a script on their
 * end. Where that script does not run - a plain text browser, an email
 * reader, a crawler, an offline page - the link lands on a 404 instead of
 * opening a mail client. The contact form falls back to that address, so a
 * broken one means a message that never gets sent.
 *
 * The <!--email_off--> markers are Cloudflare's documented exemption. They
 * have to be real HTML comments, which React does not emit from JSX, so the
 * two comment nodes are injected here and the real markup is rendered
 * normally between them.
 */
export default function EmailOff({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: "<!--email_off-->" }} />
      {children}
      <span dangerouslySetInnerHTML={{ __html: "<!--/email_off-->" }} />
    </>
  );
}
