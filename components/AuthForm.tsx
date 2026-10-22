"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSlice } from "@/components/i18n/slice";
import { account } from "@/components/i18n/account";
import { useAuth } from "@/components/AuthProvider";

/**
 * The sign-in and sign-up form.
 *
 * One component, two modes. The difference that matters: signing up asks for
 * a username, and the email address is optional - the platform does not need
 * it, and asking for something you do not need is a good way to lose people.
 */

export type AuthMode = "signIn" | "signUp";

export default function AuthForm({
  mode,
  onDone,
}: {
  mode: AuthMode;
  /** Called once the reader is signed in. */
  onDone?: (profile: { displayName: string }) => void;
}) {
  const t = useSlice(account);
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const signingUp = mode === "signUp";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    // The box is required in the browser, and the server asks for it too.
    // Both, because a required attribute is a convenience and a server that
    // does not ask is a hole.
    if (!agreed) {
      setError("mustAgree");
      return;
    }

    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);

    const body: Record<string, string> = {
      password: String(data.get("password") ?? ""),
      acceptedTerms: "true",
    };

    if (signingUp) {
      body.handle = String(data.get("handle") ?? "");
      body.displayName = String(data.get("displayName") ?? "");
      // The email is optional. An empty field is not an empty account.
      const email = String(data.get("email") ?? "").trim();
      if (email) body.email = email;
    } else {
      body.identifier = String(data.get("identifier") ?? "");
    }

    try {
      const res = await fetch(`/api/auth/${signingUp ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(payload.error ?? "generic");
        return;
      }

      await refresh();
      // The reader has somewhere to be. Staying on the form after signing
      // in was the whole bug: `/login` and `/signup` now send a
      // signed-in reader away, so this has to actually move them.
      router.replace("/profile");
      onDone?.(payload.profile);
    } catch {
      setError("generic");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card-soft rounded-3xl bg-bg p-7 sm:p-9">
      <form onSubmit={submit}>
        {signingUp && (
          <label className="mb-4 block">
            <span className="mb-2 block text-[13px] font-medium text-gray-2">
              {t.handle}
            </span>
            <input
              required
              name="handle"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              maxLength={30}
              placeholder={t.handlePlaceholder}
              className="input-ios"
            />
          </label>
        )}

        {signingUp && (
          <label className="mb-4 block">
            <span className="mb-2 block text-[13px] font-medium text-gray-2">
              {t.displayName}
            </span>
            <input
              required
              name="displayName"
              type="text"
              maxLength={80}
              autoComplete="name"
              placeholder={t.namePlaceholder}
              className="input-ios"
            />
          </label>
        )}

        {signingUp ? (
          <label className="mb-4 block">
            <span className="mb-2 block text-[13px] font-medium text-gray-2">
              {t.emailOptional}
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t.emailOptionalPlaceholder}
              className="input-ios"
            />
          </label>
        ) : (
          <label className="mb-4 block">
            <span className="mb-2 block text-[13px] font-medium text-gray-2">
              {t.identifier}
            </span>
            <input
              required
              name="identifier"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              placeholder={t.identifierPlaceholder}
              className="input-ios"
            />
          </label>
        )}

        <label className="mb-5 block">
          <span className="mb-2 block text-[13px] font-medium text-gray-2">
            {t.password}
          </span>
          <input
            required
            name="password"
            type="password"
            minLength={10}
            autoComplete={signingUp ? "new-password" : "current-password"}
            placeholder={t.passwordPlaceholder}
            className="input-ios"
          />
        </label>

        {error && (
          <p role="alert" className="mb-5 text-[14.5px] leading-relaxed text-gray-2">
            {t.errors[error as keyof typeof t.errors] ?? t.errors.generic}
          </p>
        )}

        {/* The consent.
            A box that has to be ticked, with both documents linked from the
            sentence that asks for it - not a link to a page somewhere else
            that the reader is asked to have read. The server asks for the
            same thing, so this is not only a gate in the browser. */}
        <label className="mb-5 flex items-start gap-2.5">
          <input
            type="checkbox"
            name="acceptedTerms"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-blue"
          />
          <span className="text-[14px] leading-relaxed text-gray-2">
            {t.agreeToTerms.split("{terms}")[0]}
            <Link
              href="/terms"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue hover:underline"
            >
              {t.termsOfService}
            </Link>
            {t.agreeToTerms
              .split("{terms}")[1]
              ?.split("{privacy}")[0] ?? " "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue hover:underline"
            >
              {t.privacyPolicy}
            </Link>
            {t.agreeToTerms.split("{privacy}")[1] ?? ""}
          </span>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 text-[17px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi disabled:cursor-default disabled:opacity-60 sm:w-auto"
        >
          {busy ? t.sending : signingUp ? t.signUp : t.signIn}
        </button>
      </form>

      <p className="mt-6 text-[14.5px] text-gray-2">
        {signingUp ? t.haveAccount : t.noAccount}{" "}
        <Link
          href={signingUp ? "/login" : "/signup"}
          className="font-medium text-blue hover:underline"
        >
          {signingUp ? t.switchToSignIn : t.switchToSignUp}
        </Link>
      </p>
    </div>
  );
}
