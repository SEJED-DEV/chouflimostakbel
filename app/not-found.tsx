import Link from "next/link";
import { House } from "@phosphor-icons/react/dist/ssr/House";
import { Signpost } from "@phosphor-icons/react/dist/ssr/Signpost";
import { Books } from "@phosphor-icons/react/dist/ssr/Books";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-bg pt-32 pb-20">
      <div className="mx-auto w-full max-w-2xl px-6 text-center sm:px-8">
        <p className="text-[clamp(5rem,18vw,9rem)] leading-none font-semibold tracking-[-0.05em] text-ink/10">
          404
        </p>

        <h1 className="-mt-4 text-[clamp(1.6rem,4.5vw,2.4rem)] font-semibold tracking-[-0.03em] text-ink sm:-mt-6">
          This page went looking for a different future.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-gray-2">
          The link may be old, or the page may have moved. Nothing here is lost
          though - pick a path below.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/", label: "Home", Icon: House },
            { href: "/dropouts", label: "School Dropouts", Icon: Signpost },
            { href: "/divisions", label: "HS Divisions", Icon: Books },
            { href: "/graduates", label: "Graduates", Icon: GraduationCap },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="card-soft card-soft-hover flex items-center gap-3 rounded-2xl bg-bg-alt px-5 py-4 text-left text-[16px] font-medium text-ink"
            >
              <l.Icon size={20} weight="regular" className="text-blue" />
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-blue px-7 py-3 text-[17px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-all duration-300 hover:bg-blue-hi hover:scale-[1.03]"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
