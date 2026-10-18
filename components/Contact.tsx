"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";

export default function Contact({
  title = "Ask us anything.",
  note = "Send us anything you want to know, and we will get back to you. Honest reviews are welcome too.",
}: {
  title?: string;
  note?: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-2xl px-6 py-24 sm:px-8">
        <div className="text-center">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.03em] text-ink">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-gray-2">
            {note}
          </p>
        </div>

        <div className="mt-10">
          {sent ? (
            <div className="card-soft flex flex-col items-center rounded-3xl bg-bg p-10 text-center">
              <CheckCircle size={44} weight="fill" className="text-blue" />
              <p className="mt-5 text-[22px] font-semibold text-ink">
                Message on its way.
              </p>
              <p className="mt-2 text-[16px] text-gray-2">
                Thanks for writing. We will get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-7 rounded-full bg-bg-alt px-6 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-sep/60"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="card-soft rounded-3xl bg-bg p-7 sm:p-9"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-gray-2">
                    Name
                  </span>
                  <input required type="text" placeholder="Your name" className="input-ios" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-gray-2">
                    Email
                  </span>
                  <input required type="email" placeholder="you@email.com" className="input-ios" />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-[13px] font-medium text-gray-2">
                  Message
                </span>
                <textarea
                  required
                  rows={4}
                  placeholder="What do you want to know?"
                  className="input-ios resize-none"
                />
              </label>
              <button
                type="submit"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 text-[17px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi sm:w-auto"
              >
                Send message
                <ArrowRight
                  size={17}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
