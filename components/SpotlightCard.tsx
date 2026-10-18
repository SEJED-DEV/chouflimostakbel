/**
 * Light, system-like card: no borders, soft layered depth, generous corner
 * radius, calm lift on hover. Groups by spacing rather than lines.
 */
export default function Card({
  children,
  className = "",
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl bg-bg ${
        interactive ? "card-soft card-soft-hover" : "card-soft"
      } ${className}`}
    >
      {children}
    </div>
  );
}
