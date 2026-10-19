import { site } from "@/lib/site";

/**
 * A landing page for Cloudflare's obfuscated email links.
 *
 * Cloudflare rewrites email addresses into /cdn-cgi/l/email-protection links
 * and decodes them with a script on their side. Where that script does not
 * run, the path reaches us and would 404 - which is a confusing way to find
 * out an email address.
 *
 * The markup now carries Cloudflare's own <!--email_off--> exemption, so this
 * should never be reached. It stays for pages cached before that, for
 * browsers that block the script, and for anything else that ends up here.
 */
export async function GET() {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${site.name}</title>
<style>
  body { margin: 0; min-height: 100dvh; display: flex; align-items: center;
         justify-content: center; background: #ffffff; color: #1d1d1f;
         font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
         padding: 2rem; text-align: center; }
  a { color: #0071e3; }
  p { color: #6e6e73; line-height: 1.6; }
  @media (prefers-color-scheme: dark) {
    body { background: #000000; color: #f5f5f7; }
    p { color: #a1a1a6; }
    a { color: #0a84ff; }
  }
</style>
</head>
<body>
  <div>
    <h1 style="font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em;">${site.name}</h1>
    <p>Write to us at <a href="mailto:${site.email}">${site.email}</a></p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
