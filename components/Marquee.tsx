/**
 * Terracotta ink band of opportunity names gliding sideways, pausing on
 * hover. One per page, maximum.
 */
export default function Marquee({ items }: { items: string[] }) {
  const row = (key: string) => (
    <div
      key={key}
      aria-hidden={key === "b"}
      className="marquee-track flex shrink-0 items-center gap-8 pr-8"
    >
      {items.map((item) => (
        <span key={item} className="flex items-center gap-8">
          <span className="font-display text-3xl italic text-paper sm:text-4xl">
            {item}
          </span>
          <span className="text-ochre">&#9670;</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative flex overflow-hidden border-b-2 border-ink bg-terra py-5">
      {row("a")}
      {row("b")}
    </div>
  );
}
