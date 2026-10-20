import type { IconName } from "@/components/Icons";

/**
 * The platform's roles, and the badges that go with them.
 *
 * Which roles *exist* is fixed here and enforced again by a constraint in the
 * database - a role outside this list cannot be stored, let alone rendered.
 * Which roles a *person* holds lives in `profiles.roles`, so granting one is
 * an ordinary write and not a deploy.
 *
 * The order of this object is the order the badges appear in. A stable
 * hierarchy beats a stable timestamp: leadership first, the people who built
 * it next, then everyone else.
 */

export const ROLES = {
  leadership: { icon: "leadership", tone: "#b45309" },
  dev: { icon: "dev", tone: "#7c3aed" },
  staff: { icon: "staff", tone: "#0369a1" },
  contributor: { icon: "star", tone: "#ca8a04" },
  secret: { icon: "secret", tone: "#475569" },
} as const satisfies Record<string, { icon: IconName; tone: string }>;

export type RoleKey = keyof typeof ROLES;

const KEYS = Object.keys(ROLES) as RoleKey[];

/** Every role, in badge order. Used to seed and to test. */
export const ALL_ROLES: RoleKey[] = KEYS;

/** Is this a role the platform knows about? */
export function isRole(value: unknown): value is RoleKey {
  return typeof value === "string" && (KEYS as string[]).includes(value);
}

/**
 * A stored role list, sorted into badge order and stripped of anything that
 * is not a real role.
 *
 * The database refuses unknown roles, but this runs on data that may have
 * been written before a role was renamed, and a badge nobody defined should
 * not reach the page.
 */
export function normaliseRoles(value: unknown): RoleKey[] {
  if (!Array.isArray(value)) return [];
  const held = new Set(value.filter(isRole));
  return KEYS.filter((k) => held.has(k));
}

/** Does this person hold a role? */
export function hasRole(roles: readonly RoleKey[], key: RoleKey): boolean {
  return roles.includes(key);
}
