"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icons";
import Reveal, { Rule } from "@/components/Reveal";
import { useSlice } from "@/components/i18n/slice";
import { account } from "@/components/i18n/account";
import { blogs } from "@/components/i18n/blogs";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import SettingsButton from "@/components/SettingsSheet";
import { ROLES, normaliseRoles, type RoleKey } from "@/lib/roles";
import type { PostSummary } from "@/lib/posts";

/**
 * The reader's own profile.
 *
 * It is the page the account is for: what you look like, how old you are,
 * which badges you carry, and what you have written. Signed out, it sends
 * you to the sign-in page rather than pretending to be empty.
 *
 * The photo never leaves the browser as a file. It is drawn onto a canvas,
 * cropped, resized and compressed to WebP, and stored as a data URL - which
 * is why there is no upload endpoint and no image host to be down.
 */

/** Square, and small enough to sit in a comment thread one day. */
const AVATAR_SIZE = 256;
/** A banner is wide and read once. */
const BANNER = { width: 1200, height: 400, quality: 0.8 };

function downscale(
  file: File,
  size: { width: number; height: number; quality: number },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;

      // Crop to the centre before scaling, so a tall photo does not end up
      // as a letterboxed strip across the profile.
      const scale = Math.max(size.width / image.width, size.height / image.height);
      const drawnWidth = image.width * scale;
      const drawnHeight = image.height * scale;
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("no canvas"));

      context.drawImage(
        image,
        (size.width - drawnWidth) / 2,
        (size.height - drawnHeight) / 2,
        drawnWidth,
        drawnHeight,
      );
      resolve(canvas.toDataURL("image/webp", size.quality));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("not an image"));
    };
    image.src = url;
  });
}

/** Badges in the database's order, not the order they were granted in. */
function BadgeRow({ roles }: { roles: RoleKey[] }) {
  if (!roles.length) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {roles.map((key) => {
        const role = ROLES[key];
        return (
          <li
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full bg-bg-alt px-2.5 py-1 text-[12.5px] font-medium"
            style={{ color: role.tone }}
            title={key}
          >
            <Icon name={role.icon} size={13} />
            {key}
          </li>
        );
      })}
    </ul>
  );
}

export default function ProfileContent() {
  const t = useSlice(account);
  const b = useSlice(blogs);
  const { lang } = useLanguage();
  const router = useRouter();
  const { profile, loading, refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<PostSummary[] | null>(null);

  useEffect(() => {
    if (!loading && !profile) router.replace("/login");
  }, [loading, profile, router]);

  useEffect(() => {
    if (profile) {
      setName(profile.displayName);
      setEmail(profile.email ?? "");
      setBirth(profile.dateOfBirth ?? "");
    }
  }, [profile]);

  // Your own posts, drafts included, fetched once there is a session to
  // fetch them with. A failure leaves the list absent rather than empty, so
  // "nothing here yet" is never shown to someone who has written something.
  useEffect(() => {
    if (!profile) return;
    let alive = true;

    fetch("/api/posts")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data?.ok) setPosts(data.posts as PostSummary[]);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [profile]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
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
        body: JSON.stringify({
          displayName,
          email,
          dateOfBirth: birth || null,
          // Absent means "leave it alone", which is what these two are.
          avatarUrl: profile.avatarUrl,
          bannerUrl: profile.bannerUrl,
        }),
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

  /** Reads a chosen file, fits it, and PATCHes it. */
  async function setPicture(
    file: File,
    field: "avatarUrl" | "bannerUrl",
    size: { width: number; height: number; quality: number },
  ) {
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await downscale(file, size);
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: dataUrl }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload.error ?? "invalidPhoto");
        return;
      }
      await refresh();
    } catch {
      setError("invalidPhoto");
    } finally {
      setBusy(false);
    }
  }

  async function clearPicture(field: "avatarUrl" | "bannerUrl") {
    setBusy(true);
    try {
      await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: null }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!profile) return null;

  const roles = normaliseRoles(profile.roles);
  const joined = new Date(profile.memberSince);
  const memberSince = Number.isNaN(joined.getTime())
    ? ""
    : t.memberSince.replace(
        "{date}",
        new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(joined),
      );

  return (
    <>
      <section className="bg-bg pt-28 pb-8 sm:pt-32">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <Reveal>
            <div className="flex items-start justify-between gap-4">
              <p className="text-[13px] font-semibold text-blue">
                Choufli Mosta9bel
              </p>
              {/* On a phone there is no top bar to carry a settings control,
                  so it lives here instead. */}
              <SettingsButton className="flex h-9 w-9 items-center justify-center rounded-full text-gray-2 transition-colors hover:bg-ink/[0.06] hover:text-ink md:hidden" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          {/* The banner, and the photo that overlaps it. */}
          <div className="relative">
            <div className="h-36 overflow-hidden rounded-3xl bg-bg-alt sm:h-44">
              {profile.bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.bannerUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : null}
              <button
                type="button"
                onClick={() => bannerInput.current?.click()}
                className="absolute end-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur transition-colors hover:bg-black/60"
              >
                {t.banner}
              </button>
            </div>

            <div className="-mt-12 flex items-end gap-4 ps-3">
              <button
                type="button"
                onClick={() => avatarInput.current?.click()}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-bg-alt ring-4 ring-bg sm:h-28 sm:w-28"
                aria-label={t.photo}
              >
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={t.photoAlt.replace("{name}", profile.displayName)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-gray">
                    <Icon name="circle-user" size={48} />
                  </span>
                )}
              </button>

              <div className="min-w-0 pb-1">
                <h1 className="truncate text-[26px] font-semibold tracking-[-0.025em] text-ink sm:text-[32px]">
                  {profile.displayName}
                </h1>
                <p className="truncate text-[15px] text-gray-2">@{profile.handle}</p>
              </div>
            </div>

            <input
              ref={avatarInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file)
                  void setPicture(file, "avatarUrl", {
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    quality: 0.9,
                  });
                e.target.value = "";
              }}
            />
            <input
              ref={bannerInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void setPicture(file, "bannerUrl", BANNER);
                e.target.value = "";
              }}
            />
          </div>

          <BadgeRow roles={roles} />

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[14.5px]">
            {profile.dateOfBirth && (
              <div>
                <dt className="text-gray">{t.dateOfBirth}</dt>
                <dd className="mt-0.5 text-ink">
                  {new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(
                    new Date(`${profile.dateOfBirth}T00:00:00Z`),
                  )}
                </dd>
              </div>
            )}
            {memberSince && (
              <div>
                <dt className="text-gray">{t.memberSince.replace("{date}", "")}</dt>
                <dd className="mt-0.5 text-ink">{memberSince}</dd>
              </div>
            )}
          </dl>

          <Rule className="mt-9" />

          <form onSubmit={save} className="card-soft mt-9 rounded-3xl bg-bg p-7 sm:p-9">
            <label className="mb-4 block">
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

            <label className="mb-4 block">
              <span className="mb-2 block text-[13px] font-medium text-gray-2">
                {t.email}
              </span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="input-ios"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-gray-2">
                {t.dateOfBirth}
              </span>
              <input
                name="dateOfBirth"
                type="date"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="input-ios"
              />
              <span className="mt-2 block text-[13.5px] leading-relaxed text-gray">
                {t.dateOfBirthHint}
              </span>
            </label>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => avatarInput.current?.click()}
                className="rounded-full bg-bg-alt px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-sep/60"
              >
                {t.changePhoto}
              </button>
              {profile.avatarUrl && (
                <button
                  type="button"
                  onClick={() => clearPicture("avatarUrl")}
                  className="rounded-full bg-bg-alt px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-sep/60"
                >
                  {t.removePhoto}
                </button>
              )}
            </div>

            {error && (
              <p role="alert" className="mt-3 text-[14.5px] text-gray-2">
                {t.errors[error as keyof typeof t.errors] ?? t.errors.generic}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-5 rounded-full bg-blue px-6 py-2.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi disabled:opacity-60"
            >
              {busy ? t.sending : t.saveName}
            </button>
          </form>

          {/* Your own posts. Drafts are listed here and nowhere else on the
              site, which is what makes this list worth having. */}
          <div className="card-soft mt-5 rounded-3xl bg-bg p-7 sm:p-9">
            <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">
              {t.yourPosts}
            </h2>

            {posts && posts.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/community/${post.slug}`}
                      className="group flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl border border-sep px-4 py-3 transition-colors duration-300 hover:border-blue/40"
                    >
                      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink transition-colors duration-300 group-hover:text-blue">
                        {post.title}
                      </span>
                      <span className="text-[13px] text-gray">
                        {post.status === "draft"
                          ? b.draft
                          : new Intl.DateTimeFormat(lang, {
                              dateStyle: "medium",
                            }).format(new Date(post.publishedAt ?? post.updatedAt))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[16px] leading-relaxed text-gray-2">
                {t.yourPostsBody}
              </p>
            )}

            <Link
              href="/community/new"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-[14px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
            >
              <Icon name="square-pen" size={15} />
              {b.writeOne}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
