"use client";

import { DownloadIcon } from "./SiteIcons";
import { promptInstall, INSTALL_SHEET, isInstalled } from "@/lib/pwa";
import { useLanguage } from "./LanguageProvider";

/**
 * Install-the-app button.
 *
 * Calls the browser's own install prompt where one is available. On iOS
 * Safari - which has no install API and never fires the event - it falls
 * back to the manual instructions sheet rather than doing nothing.
 *
 * Renders nothing once the site is already installed.
 */
export default function DownloadButton({
  variant = "icon",
  className = "",
}: {
  /** `icon` for the nav capsule, `pill` for the footer. */
  variant?: "icon" | "pill";
  className?: string;
}) {
  const { t } = useLanguage();

  if (isInstalled()) return null;

  async function handleClick() {
    const done = await promptInstall();
    if (!done) {
      // No native prompt (iOS, or an already-dismissed browser prompt):
      // show the manual steps instead of silently failing.
      INSTALL_SHEET.open();
    }
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-bg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      >
        <DownloadIcon size={16} />
        {t.install.action}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t.install.action}
      title={t.install.action}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-gray-2 transition-colors hover:bg-ink/[0.06] hover:text-ink ${className}`}
    >
      <DownloadIcon size={19} />
    </button>
  );
}
