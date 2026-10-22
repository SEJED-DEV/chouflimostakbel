"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Icon from "@/components/Icons";
import { useSlice } from "@/components/i18n/slice";
import { account } from "@/components/i18n/account";
import { useAuth } from "@/components/AuthProvider";
import { isStaff, normaliseRoles } from "@/lib/roles";
import { useAvatarTheme } from "@/components/useAvatarTheme";

/**
 * The account button, and the menu it opens.
 *
 * The button carries the reader's own photograph. A generic person icon
 * says "there is an account here"; a photograph says "this is the person who
 * signed in", which is the thing the reader is actually checking. The name
 * stays beside it, because a name and a face together is a person and
 * either one alone is a label.
 *
 * The ring around the photograph is taken from the photograph, so a pale
 * picture does not sit on a pale ring and vanish into it.
 *
 * The menu carries the three things an account can do that the navigation
 * cannot: go to the profile, open the admin panel, and sign out. Staff see
 * the second one because their roles say so; nobody else is offered a door
 * that is not there.
 *
 * Sign out lives here as well as in the settings sheet, on purpose. The
 * settings sheet is reachable from the gear, and the gear is not on every
 * page - a reader who cannot find a gear cannot find a way out, and "there
 * is a way out" should not depend on where you are standing.
 */
export default function AccountMenu({
  /** Hides the name, for the narrow capsule. */
  compact = false,
}: {
  compact?: boolean;
}) {
  const t = useSlice(account);
  const { profile, refresh } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const theme = useAvatarTheme(profile?.avatarUrl);
  const staff = isStaff(normaliseRoles(profile?.roles ?? []));

  // Close on Escape, and on a click anywhere else. The menu is a small
  // surface, and a menu that stays open under the reader's finger is a menu
  // they have to hunt for.
  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  /**
   * Sign out, then leave.
   *
   * The cookie is cleared by the route, and `refresh` asks the server who we
   * are again - which now answers nobody. The navigation happens after, so
   * the page the reader lands on is not the one they just signed out of.
   */
  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await refresh();
      setOpen(false);
      router.replace("/");
    } catch {
      // The route answers even when it fails, and the session is gone
      // either way.
      setOpen(false);
      router.replace("/");
    } finally {
      setSigningOut(false);
    }
  }

  if (!profile) return null;

  const ring = theme
    ? theme.light
      ? `inset 0 0 0 1px rgba(0,0,0,0.10), 0 0 0 2px ${theme.colour}22`
      : `inset 0 0 0 1px rgba(255,255,255,0.14), 0 0 0 2px ${theme.colour}44`
    : undefined;

  return (
    <div className="relative" ref={root}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="ml-2 inline-flex max-w-[13rem] items-center gap-2 rounded-full bg-blue px-2.5 py-1.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-hi"
      >
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            className="h-6 w-6 shrink-0 rounded-full object-cover"
            style={{ boxShadow: ring }}
            width={24}
            height={24}
          />
        ) : (
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20"
          >
            <Icon name="user" size={13} />
          </span>
        )}

        {!compact && (
          <span className="truncate">{profile.displayName}</span>
        )}

        <Icon
          name="caret-down"
          size={11}
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            className="frosted absolute end-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-2xl p-1.5"
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.16)" }}
          >
            <div className="px-3 pt-2 pb-2.5">
              <p className="truncate text-[14px] font-medium text-ink">
                {profile.displayName}
              </p>
              <p className="mt-0.5 truncate text-[12.5px] text-gray">
                @{profile.handle}
              </p>
            </div>

            <div className="my-1 h-px bg-sep" />

            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14.5px] text-ink transition-colors duration-200 hover:bg-ink/[0.05]"
            >
              <Icon name="circle-user" size={16} className="text-gray-2" />
              {t.profileLink}
            </Link>

            {staff && (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14.5px] text-ink transition-colors duration-200 hover:bg-ink/[0.05]"
              >
                <Icon name="shield" size={16} className="text-gray-2" />
                {t.adminPanel}
              </Link>
            )}

            <div className="my-1 h-px bg-sep" />

            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              disabled={signingOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-[14.5px] text-ink transition-colors duration-200 hover:bg-ink/[0.05] disabled:opacity-60"
            >
              <Icon
                name="right-from-bracket"
                size={16}
                className="text-gray-2"
              />
              {t.signOut}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
