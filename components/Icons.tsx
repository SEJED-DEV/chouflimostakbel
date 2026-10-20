import { ICONS, type IconName } from "./icons/data";

export type { IconName };

/**
 * The platform's icons.
 *
 * Every glyph is one path in one coordinate space, drawn by Font Awesome
 * Free (CC BY 4.0) and used as it ships - the paths are never redrawn, and
 * the set delivered with this platform's design is used verbatim in place of
 * the package's version of the same icon.
 *
 * Each icon carries its own `viewBox` because the set does not share one
 * grid: Font Awesome sizes a box 512 tall and lets the width follow the
 * glyph, and the delivered set sits on a 640 grid again. Hard-coding a single
 * box - the obvious implementation - distorts most of these, and the
 * delivered ones by a fifth.
 *
 * One weight only. Font Awesome Free's solid set is filled by default, so
 * "regular" and "fill" are not choices here; active state is carried by
 * colour and weight in the label, which is what was doing the work anyway.
 *
 * Decorative by default: an icon next to a text label is redundant to a
 * screen reader, so it is hidden unless it is given a `title`, at which point
 * it becomes an image with that name.
 */
export default function Icon({
  name,
  size = 20,
  className,
  style,
  title,
}: {
  name: IconName;
  /** Rendered box, in pixels. Square. */
  size?: number;
  className?: string;
  /** For the few places an icon is coloured by something other than text. */
  style?: React.CSSProperties;
  /** Omit for a decorative icon; supply to expose it as an image. */
  title?: string;
}) {
  const glyph = ICONS[name];

  return (
    <svg
      viewBox={glyph.viewBox}
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <path d={glyph.d} />
    </svg>
  );
}
