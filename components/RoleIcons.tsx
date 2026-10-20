"use client";

import Icon from "@/components/Icons";
import { useSlice } from "@/components/i18n/slice";
import { account } from "@/components/i18n/account";
import { ROLES, type RoleKey } from "@/lib/roles";

/**
 * A person's badges, drawn as icons alone.
 *
 * Used everywhere a name appears next to a post, where the row is already
 * carrying an avatar, a handle and a time and a word for every role would
 * push the byline onto a second line. The name is not lost: it is the
 * tooltip, and it is the accessible name, so a screen reader reads "Developer"
 * where the eye sees a mark.
 *
 * The version with words is on the profile page, where there is room and
 * where the badges are the point rather than a garnish.
 */
export default function RoleIcons({
  roles,
  size = 13,
  className = "",
}: {
  roles: readonly RoleKey[];
  size?: number;
  className?: string;
}) {
  const t = useSlice(account);
  if (!roles.length) return null;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {roles.map((key) => {
        const role = ROLES[key];
        const label = t.roleNames[key];
        return (
          <span
            key={key}
            title={label}
            // The tooltip is a convenience; this is what is actually read
            // out, so the badge is never a shape with no name.
            aria-label={label}
            role="img"
            className="inline-flex items-center"
            style={{ color: role.tone }}
          >
            <Icon name={role.icon} size={size} />
          </span>
        );
      })}
    </span>
  );
}
