/**
 * iOS-style shimmering skeleton placeholder. Use where content or media is
 * about to resolve, so the layout holds and the arrival feels calm.
 */
export default function Skeleton({
  className = "",
  radius = "24px",
}: {
  className?: string;
  radius?: string;
}) {
  return (
    <div
      aria-hidden
      className={`skeleton ${className}`}
      style={{ borderRadius: radius }}
    />
  );
}
