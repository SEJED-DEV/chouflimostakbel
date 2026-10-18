/**
 * Brand marks for the social platforms we link out to.
 *
 * Kept in one place so the footer, the contact section and the publisher
 * block all render identical glyphs.
 */

const GLYPHS: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
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
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  discord: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.32 4.57A19.8 19.8 0 0 0 15.43 3c-.24.42-.51.99-.7 1.44a18.3 18.3 0 0 0-5.46 0c-.19-.45-.47-1.02-.71-1.44a19.8 19.8 0 0 0-4.89 1.57C.55 9.2-.32 13.7.14 18.14a19.9 19.9 0 0 0 6.03 3.06c.49-.66.92-1.37 1.29-2.11-.71-.26-1.39-.6-2.03-1.01.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.14 0c.16.14.33.27.5.4-.64.41-1.32.75-2.03 1.01.37.74.8 1.45 1.29 2.11a19.84 19.84 0 0 0 6.03-3.06c.54-5.15-.84-9.62-3.55-13.57ZM8.02 15.42c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.18 1.09 2.16 2.41 0 1.32-.95 2.4-2.16 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.18 1.09 2.16 2.41 0 1.32-.95 2.4-2.16 2.4Z" />
    </svg>
  ),
  telegram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.9 4.3 18.7 19.6c-.24 1.06-.87 1.32-1.76.82l-4.88-3.6-2.35 2.27c-.26.26-.48.48-.99.48l.35-4.99 9.1-8.22c.4-.35-.08-.55-.61-.2L6.18 13.02 1.4 11.4c-1.04-.32-1.06-1.04.22-1.54L20.57 2.6c.87-.32 1.63.2 1.33 1.7Z" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.7a5.68 5.68 0 0 0-.77-.05A5.68 5.68 0 1 0 15.54 15.4V8.9a7.35 7.35 0 0 0 4.3 1.38V7.19a4.29 4.29 0 0 1-3.24-1.37Z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23 12s0-3.85-.49-5.7a2.98 2.98 0 0 0-2.1-2.11C18.55 3.7 12 3.7 12 3.7s-6.55 0-8.41.49A2.98 2.98 0 0 0 1.49 6.3C1 8.15 1 12 1 12s0 3.85.49 5.7a2.98 2.98 0 0 0 2.1 2.11c1.86.49 8.41.49 8.41.49s6.55 0 8.41-.49a2.98 2.98 0 0 0 2.1-2.11C23 15.85 23 12 23 12ZM9.75 15.27V8.73L15.5 12l-5.75 3.27Z" />
    </svg>
  ),
};

/** Renders the icon for a network, or nothing if we don't recognise it. */
export function SocialGlyph({ network, size = 18 }: { network: string; size?: number }) {
  const glyph = GLYPHS[network];
  if (!glyph) return null;
  // Icons are authored at 18px; scale via CSS-friendly transform-free width.
  return (
    <span style={{ display: "inline-flex", width: size, height: size }} aria-hidden>
      {glyph}
    </span>
  );
}

/** Row of circular icon buttons for a list of social links. */
export default function SocialLinks({
  links,
  className = "",
  buttonClassName = "flex h-10 w-10 items-center justify-center rounded-full bg-bg-alt text-gray-2 transition-all duration-200 hover:bg-sep/60 hover:text-ink active:scale-95",
}: {
  links: { network: string; href: string }[];
  className?: string;
  buttonClassName?: string;
}) {
  if (links.length === 0) return null;
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {links.map((s) => (
        <a
          key={`${s.network}-${s.href}`}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label={s.network}
          className={buttonClassName}
        >
          <SocialGlyph network={s.network} />
        </a>
      ))}
    </div>
  );
}
