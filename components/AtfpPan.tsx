"use client";

export type AtfpLevel = {
  code: string;
  name: string;
  body: string;
  fields: string;
  duration: string;
};

/**
 * iOS-style horizontal carousel with peeking cards and native scroll-snap.
 * Swipe (or trackpad) through the four certifications - calm and gesture-
 * driven rather than hijacking vertical scroll.
 */
export default function AtfpCarousel({
  levels,
  fieldsLabel,
}: {
  levels: AtfpLevel[];
  fieldsLabel: string;
}) {
  return (
    <div className="snap-cara px-6 pb-4 sm:px-8" style={{ scrollPaddingInline: "24px" }}>
      {levels.map((lv, i) => (
        <article
          key={lv.code}
          className="snap-card card-soft flex flex-col rounded-3xl bg-bg p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-blue/10 px-3 py-1 font-mono text-[13px] font-semibold text-blue">
              {lv.code}
            </span>
            <span className="text-[13px] font-medium text-gray">{lv.duration}</span>
          </div>

          <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.02em] text-ink">
            {lv.name}
          </h3>

          <p className="mt-3 text-[16px] leading-relaxed text-gray-2">{lv.body}</p>

          <div className="mt-6 border-t border-sep pt-5">
            <p className="text-[13px] font-semibold text-gray">{fieldsLabel}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-gray-2">
              {lv.fields}
            </p>
          </div>

          <div className="mt-auto pt-7">
            <span className="font-mono text-[12px] text-gray">
              {String(i + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
