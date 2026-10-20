"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import Reveal, { Rule } from "@/components/Reveal";
import { useSlice } from "@/components/i18n/slice";
import { account } from "@/components/i18n/account";
import { useAuth } from "@/components/AuthProvider";

/**
 * The reader's own profile.
 *
 * It is the page the account is for: who you are, what you have written, and
 * the way out. Signed out, it sends you to the sign-in page rather than
 * pretending to be empty.
 */
export default function ProfileContent() {
  const t = useSlice(account);
  const router = useRouter();
  const { profile, loading, refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!loading && !profile) router.replace("/login");
  }, [loading, profile, router]);

  useEffect(() => {
    if (profile) setName(profile.displayName);
  }, [profile]);

  async function saveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !profile) return;

    const displayName = name.trim();
    if (!displayName) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload.error ?? "generic");
        return;
      }
      await refresh();
    } catch {
      setError("generic");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await refresh();
      router.replace("/");
    } finally {
      setBusy(false);
    }
  }

  if (!profile) return null;

  return (
    <>
      <section className="bg-bg pt-36 pb-8 sm:pt-44">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">@{profile.handle}</p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.profileTitle}
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.profileSub}
            </p>
          </Reveal>
          <Rule className="mt-10" />
        </div>
      </section>

      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <div className="card-soft rounded-3xl bg-bg p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <CheckCircle size={32} weight="fill" className="mt-0.5 shrink-0 text-blue" />
              <div className="min-w-0">
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                  {t.signedInAs.replace("{name}", profile.displayName)}
                </h2>
                <p className="mt-1.5 break-all text-[15px] text-gray-2">
                  @{profile.handle}
                </p>
                {profile.email && (
                  <p className="mt-1 break-all text-[15px] text-gray-2">
                    {profile.email}
                  </p>
                )}
              </div>
            </div>

            {!profile.verified && profile.email && (
              <p className="mt-5 rounded-2xl bg-bg-alt px-4 py-3 text-[15px] leading-relaxed text-gray-2">
                {t.notVerified}
              </p>
            )}

            <form onSubmit={saveName} className="mt-6">
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-gray-2">
                  {t.displayName}
                </span>
                <input
                  name="displayName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  className="input-ios"
                />
              </label>
              {error && (
                <p role="alert" className="mt-3 text-[14.5px] text-gray-2">
                  {t.errors[error as keyof typeof t.errors] ?? t.errors.generic}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="mt-3 rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60 disabled:opacity-60"
              >
                {busy ? t.sending : t.saveName}
              </button>
            </form>

            <button
              type="button"
              onClick={signOut}
              disabled={busy}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60 disabled:opacity-60"
            >
              <SignOut size={16} weight="bold" />
              {t.signOut}
            </button>
          </div>

          {/* The posts will go here. Saying so is better than an empty box. */}
          <div className="card-soft mt-5 rounded-3xl bg-bg p-7 sm:p-9">
            <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">
              {t.yourPosts}
            </h2>
            <p className="mt-2 text-[16px] leading-relaxed text-gray-2">
              {t.yourPostsBody}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
