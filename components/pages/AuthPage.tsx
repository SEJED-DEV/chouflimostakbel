"use client";

import Reveal, { Rule } from "@/components/Reveal";
import AuthForm, { type AuthMode } from "@/components/AuthForm";
import { useSlice } from "@/components/i18n/slice";
import { account } from "@/components/i18n/account";

/** The shell the sign-in and sign-up pages share. */
export default function AuthPage({ mode }: { mode: AuthMode }) {
  const t = useSlice(account);

  return (
    <>
      <section className="bg-bg pt-36 pb-8 sm:pt-44">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">Choufli Mosta9bel</p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.title}{" "}
              {t.titleAccent && <span className="text-gray">{t.titleAccent}</span>}
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">{t.sub}</p>
          </Reveal>
          <Rule className="mt-10" />
        </div>
      </section>

      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <AuthForm mode={mode} />
        </div>
      </section>
    </>
  );
}
