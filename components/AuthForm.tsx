"use client";

import { useState } from "react";
import Link from "next/link";
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
  const { refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signingUp = mode === "signUp";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);

    const body: Record<string, string> = {
      password: String(data.get("password") ?? ""),
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
