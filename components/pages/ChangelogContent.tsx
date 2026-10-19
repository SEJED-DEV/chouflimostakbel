"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { Wrench } from "@phosphor-icons/react/dist/ssr/Wrench";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";
import { Minus } from "@phosphor-icons/react/dist/ssr/Minus";
import Reveal, { Rule } from "@/components/Reveal";
import { useSlice } from "@/components/i18n/slice";
import { changelog, type ChangeKind, type ChangelogEntry } from "@/components/i18n/changelog";
import ChangelogCommits from "@/components/ChangelogCommits";
import DeployStatusLine from "@/components/DeployStatus";
import PushOptIn from "@/components/PushOptIn";

type Filter = ChangeKind | "all";

/**
 * The kinds, in the order they are shown inside a release, with the colour
 * and the icon that stand for each one.
 *
 * The colours are Apple's system colours, the same ones the deploy status
 * uses, so the page stays in one visual language.
 */
const KINDS: {
  id: ChangeKind;
  color: string;
  Icon: typeof Plus;
}[] = [
  { id: "added", color: "#0071e3", Icon: Plus },
  { id: "fixed", color: "#34c759", Icon: Wrench },
  { id: "changed", color: "#ff9f0a", Icon: ArrowClockwise },
  { id: "removed", color: "#ff453a", Icon: Minus },
];

/** The dark-mode counterparts of the two colours that change. */
const DARK_COLOR: Record<string, string> = {
  "#0071e3": "#0a84ff",
};

export default function ChangelogContent() {
  const t = useSlice(changelog);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  // The newest release starts open. The rest are closed, so the page stays
  // the same height however long the changelog gets.
  const [open, setOpen] = useState<string[]>([t.entries[0]?.version ?? ""]);

  const label = (kind: ChangeKind) =>
    kind === "added"
      ? t.groupAdded
      : kind === "fixed"
        ? t.groupFixed
        : kind === "changed"
          ? t.groupChanged
          : t.groupRemoved;

  const filters: { id: Filter; text: string }[] = [
    { id: "all", text: t.filterAll },
    { id: "added", text: t.filterAdded },
    { id: "fixed", text: t.filterFixed },
    { id: "changed", text: t.filterChanged },
    { id: "removed", text: t.filterRemoved },
  ];

  /**
   * The releases to show, and which of their changes survive the filter.
   *
   * A release matches on its own text - the version or the summary - or on any
   * of its changes. When the release itself matches, all of its changes of
   * the chosen kind are shown; otherwise only the ones that matched.
   */
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();

    return t.entries
      .map((entry) => {
        const ofKind = entry.changes.filter((c) => filter === "all" || c.kind === filter);
        const entryMatches =
          !q ||
          entry.version.toLowerCase().includes(q) ||
          entry.summary.toLowerCase().includes(q);
        const matching = ofKind.filter((c) => c.text.toLowerCase().includes(q));

        if (filter !== "all" && ofKind.length === 0) return null;
        if (q && !entryMatches && matching.length === 0) return null;

        return {
          entry,
          changes: q && !entryMatches ? matching : ofKind,
        };
      })
      .filter((x): x is { entry: ChangelogEntry; changes: ChangelogEntry["changes"] } => x !== null);
  }, [t.entries, query, filter]);

  const searching = query.trim().length > 0;

  function toggle(version: string) {
    setOpen((current) =>
      current.includes(version)
        ? current.filter((v) => v !== version)
        : [...current, version],
    );
  }

  function clear() {
    setQuery("");
    setFilter("all");
  }

  return (
    <>
      {/* HEADER */}
      <section className="bg-bg pt-36 pb-8 sm:pt-44">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">{t.header.eyebrow}</p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.header.title} <span className="text-gray">{t.header.titleAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.header.sub}
            </p>
            <DeployStatusLine />
            <PushOptIn className="mt-4" />
          </Reveal>
          <Rule className="mt-10" />
        </div>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="bg-bg pb-6">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={16}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-gray"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="input-ios ps-10"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={
                    filter === f.id
                      ? "rounded-full bg-ink px-3.5 py-2 text-[13px] font-medium text-bg transition-colors duration-200"
                      : "rounded-full bg-bg-alt px-3.5 py-2 text-[13px] font-medium text-gray-2 transition-colors duration-200 hover:text-ink"
                  }
                >
                  {f.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELEASES */}
      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          {shown.length === 0 ? (
            <div className="rounded-2xl border border-sep bg-bg p-8 text-center sm:p-10">
              <p className="text-[18px] font-semibold text-ink">{t.noResults}</p>
              <p className="mt-2 text-[15px] text-gray-2">{t.noResultsBody}</p>
              <button
                type="button"
                onClick={clear}
                className="mt-5 rounded-full bg-bg-alt px-5 py-2.5 text-[14px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <ol className="grid gap-3">
              {shown.map(({ entry, changes }, i) => {
                // While searching, everything that matched is open. Otherwise
                // the reader decides.
                const isOpen = searching || open.includes(entry.version);
                const isLatest = t.entries[0]?.version === entry.version;
                const count = entry.changes.length;

                return (
                  <li key={entry.version}>
                    <Reveal delay={Math.min(i * 0.04, 0.2)}>
                      <article className="overflow-hidden rounded-2xl border border-sep bg-bg">
                        <button
                          type="button"
                          onClick={() => toggle(entry.version)}
                          aria-expanded={isOpen}
                          className="group flex w-full items-start gap-4 p-5 text-start transition-colors duration-200 hover:bg-bg-alt/50 sm:p-6"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                              <span className="font-mono text-[15px] font-semibold tracking-[-0.01em] text-ink">
                                {entry.version}
                              </span>
                              {isLatest && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-blue">
                                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blue" />
                                  {t.latest}
                                </span>
                              )}
                              <span className="text-[13px] text-gray">{entry.date}</span>
                              <span aria-hidden className="text-sep">
                                &middot;
                              </span>
                              <span className="text-[13px] text-gray">
                                {count === 1
                                  ? t.changeCountOne
                                  : t.changeCount.replace("{n}", String(count))}
                              </span>
                            </div>
                            <p className="mt-2 text-[16px] leading-relaxed text-gray-2">
                              {entry.summary}
                            </p>
                          </div>

                          <CaretDown
                            size={18}
                            weight="bold"
                            className={`mt-1 shrink-0 text-gray transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-sep px-5 pb-6 pt-5 sm:px-6 sm:pb-7">
                                {KINDS.map((k) => {
                                  const items = changes.filter((c) => c.kind === k.id);
                                  if (!items.length) return null;
                                  const { Icon } = k;
                                  return (
                                    <div key={k.id} className="mb-5 last:mb-0">
                                      <p className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.07em] text-gray uppercase">
                                        <Icon size={13} weight="bold" style={{ color: k.color }} />
                                        {label(k.id)}
                                      </p>
                                      <ul className="mt-3 space-y-2.5">
                                        {items.map((c, n) => (
                                          <li
                                            key={n}
                                            className="flex gap-3 text-[15px] leading-relaxed text-gray-2"
                                          >
                                            <span
                                              aria-hidden
                                              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                                              style={{ backgroundColor: k.color }}
                                            />
                                            <span>{c.text}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  );
                                })}

                                <ChangelogCommits entry={entry} label={t.commitsLabel} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
