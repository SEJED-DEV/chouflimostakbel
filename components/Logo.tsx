export default function Logo({ className = "h-8" }: { className?: string }) {
  // Original colored mark (favicon.png from the live site). On the white
  // frosted nav its white background reads as clean, no frame needed.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/favicon.png"
      alt="Choufli Mosta9bel"
      className={`${className} w-auto`}
    />
  );
}
