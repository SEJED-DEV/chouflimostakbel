"use client";

import Icon from "@/components/Icons";
import Link from "next/link";

import Reveal, { Rule } from "@/components/Reveal";
import RoleIcons from "@/components/RoleIcons";
import { useSlice } from "@/components/i18n/slice";
import { blogs } from "@/components/i18n/blogs";
import { account } from "@/components/i18n/account";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { isOlderThan, relativeLabel, relativeTime } from "@/lib/time";
import { ROLES, type RoleKey } from "@/lib/roles";
import type { PublicProfile } from "@/lib/people";
import type { PostSummary } from "@/lib/posts";

/**
 * A person, as anyone can see them.
 *
 * Everything on this page comes from the `public_profiles` view, which holds
 * the name, the photo, the banner, the badges, the join date and how much
 * they have published. The address, the birthday and the verification time
 * are not in that view, so they cannot appear here even by mistake.
 *
 * This is a different page from `/profile`, which stays the private one where
 * you edit yourself. A person's own link resolves here like anyone else's,
 * because a link that behaves differently depending on who clicked it is a
 * link that has to be explained.
 */
export default function PersonContent({
  person,
  posts,
  now,
}: {
  person: PublicProfile;
  posts: PostSummary[];
  /** The server's clock, so the stamps are in the HTML. */
  now: string;
}) {
  const t = useSlice(blogs);
  const a = useSlice(account);
  const { lang } = useLanguage();
  const { profile } = useAuth();

  const mine = profile?.id === person.id;

  const joined = new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(
    new Date(person.joinedAt),
  );

  return (
    <>
      <section className="bg-bg">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          {/* The banner, when there is one, is the top of the card. */}
          {person.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.banner}
              alt=""
              className="mt-28 h-40 w-full rounded-3xl object-cover sm:mt-32 sm:h-52"
            />
          )}

          <Reveal>
            <div className={person.banner ? "mt-6" : "mt-28 sm:mt-32"}>
              <div className="flex flex-wrap items-center gap-5">
                {person.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.avatar}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover"
                    width={80}
                    height={80}
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-alt">
                    <Icon name="user" size={30} className="text-gray" />
                  </span>
                )}

                <div className="min-w-0">
                  <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
                    {person.name}
                  </h1>
                  <p className="mt-1 text-[15px] text-gray">
                    @{person.handle}
                  </p>
                </div>
              </div>

              {/* The badges, with their names, because this is the one place
                  where there is room for the words. */}
              {person.roles.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {person.roles.map((key: RoleKey) => {
                    const role = ROLES[key];
                    return (
                      <li
                        key={key}
                        className="inline-flex items-center gap-1.5 rounded-full bg-bg-alt px-2.5 py-1 text-[12.5px] font-medium"
                        style={{ color: role.tone }}
                      >
                        <Icon name={role.icon} size={13} />
                        {a.roleNames[key]}
                      </li>
                    );
                  })}
                </ul>
              )}

              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-gray">
                <span>{a.memberSince.replace("{date}", joined)}</span>
                <span>
                  {t.postCount.replace("{n}", String(person.postCount))}
                </span>
              </p>

              {mine && (
                <div className="mt-6">
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-[14px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
                  >
                    <Icon name="gear" size={15} />
                    {a.profileTitle}
                  </Link>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg pb-24 pt-10 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Rule />

          <h2 className="mt-10 text-[19px] font-semibold tracking-[-0.02em] text-ink">
            {t.byPerson.replace("{name}", person.name)}
          </h2>

          {posts.length === 0 ? (
            <p className="mt-4 text-[16px] leading-relaxed text-gray-2">
              {t.nothingPublished}
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="group block rounded-3xl border border-sep bg-bg p-6 transition-colors duration-300 hover:border-blue/40"
                  >
                    <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-blue">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-2">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="mt-3 flex flex-wrap items-center gap-x-3 text-[13px] text-gray">
                      {post.publishedAt && (
                        <span>
                          {isOlderThan(post.publishedAt, now)
                            ? `${t.publishedOn} ${new Intl.DateTimeFormat(lang, {
                                dateStyle: "long",
                              }).format(new Date(post.publishedAt))}`
                            : t.postedAgo.replace(
                                "{when}",
                                relativeLabel(t, relativeTime(post.publishedAt, now)),
                              )}
                        </span>
                      )}
                      <span>
                        {t.minRead.replace("{n}", String(post.readingMinutes))}
                      </span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
