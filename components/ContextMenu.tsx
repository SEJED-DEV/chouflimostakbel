"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShareNetwork } from "@phosphor-icons/react/dist/ssr/ShareNetwork";
import { Copy } from "@phosphor-icons/react/dist/ssr/Copy";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { Moon } from "@phosphor-icons/react/dist/ssr/Moon";
import { Sun } from "@phosphor-icons/react/dist/ssr/Sun";
import { useTheme } from "./ThemeProvider";
import { useT } from "./LanguageProvider";
import { canPromptDirectly, promptInstall, INSTALL_SHEET } from "@/lib/pwa";

/**
 * The site's own context menu.
 *
 * A right click on a link gives you the things a reader actually wants - the
 * link in a new tab, the link on the clipboard, a way to share it - instead
 * of the browser's list, which is mostly about developer tools.
 *
 * It is deliberately conservative:
 *
 * - Touch is left alone. A long press on a phone selects text, and taking
 *   that away would be hostile.
 * - Shift and right click gives the native menu back, for anyone who wants
 *   the browser's own.
 * - It never blocks text selection, and it is fully keyboard operable.
 */

interface MenuItem {
  id: string;
  label: string;
  Icon: typeof ShareNetwork;
  run: () => void;
}

interface MenuState {
  x: number;
  y: number;
  items: MenuItem[];
}

export default function ContextMenu() {
  const { resolved, toggle: toggleTheme } = useTheme();
  const { t } = useT();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [active, setActive] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    // The install prompt is offered once, early, and can be missed entirely.
    setInstallable(canPromptDirectly());
    return undefined;
  }, []);

  const close = useCallback(() => {
    setMenu(null);
    setActive(0);
  }, []);

  useEffect(() => {
    if (!menu) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    // A scroll or a resize moves the anchor out from under the menu.
    const onDismiss = () => close();

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onDismiss, true);
    window.addEventListener("resize", onDismiss);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onDismiss, true);
      window.removeEventListener("resize", onDismiss);
    };
  }, [menu, close]);

  useEffect(() => {
    if (!menu) return;

    function onContextMenu(event: MouseEvent) {
      // Shift is the escape hatch: the browser's own menu, untouched.
      if (event.shiftKey) return;

      // Touch devices long press to select text. Leave that alone.
      if (!window.matchMedia("(pointer: fine)").matches) return;

      const target = event.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement | null;

      const items: MenuItem[] = [];

      if (link) {
        const href = link.href;
        const absolute = new URL(href, window.location.href).href;

        items.push({
          id: "open",
          label: t.contextMenu.openInNewTab,
          Icon: ArrowSquareOut,
          run: () => window.open(absolute, "_blank", "noopener,noreferrer"),
        });
        items.push({
          id: "copy-link",
          label: t.contextMenu.copyLink,
          Icon: Copy,
          run: () => void navigator.clipboard?.writeText(absolute),
        });
      } else {
        items.push({
          id: "copy-page",
          label: t.contextMenu.copyPage,
          Icon: Copy,
          run: () => void navigator.clipboard?.writeText(window.location.href),
        });
      }

      items.push({
        id: "share",
        label: t.contextMenu.share,
        Icon: ShareNetwork,
        run: () => {
          const url = link
            ? new URL(link.href, window.location.href).href
            : window.location.href;
          if (navigator.share) {
            void navigator.share({ title: document.title, url });
          } else {
            void navigator.clipboard?.writeText(url);
          }
        },
      });

      if (installable) {
        items.push({
          id: "install",
          label: t.contextMenu.installApp,
          Icon: DownloadSimple,
          run: () => {
            void promptInstall().then((done) => {
              if (!done) INSTALL_SHEET.open();
            });
          },
        });
      }

      items.push({
        id: "theme",
        label: resolved === "dark" ? t.contextMenu.lightTheme : t.contextMenu.darkTheme,
        Icon: resolved === "dark" ? Sun : Moon,
        run: toggleTheme,
      });

      event.preventDefault();
      setMenu({ x: event.clientX, y: event.clientY, items });
      setActive(0);
    }

    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, [installable, resolved, toggleTheme, t]);

  // Keyboard navigation inside the menu.
  useEffect(() => {
    if (!menu) return;
    const items = menu.items;

    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((i) => (i + 1) % items.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((i) => (i - 1 + items.length) % items.length);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const item = items[active];
        if (item) {
          item.run();
          close();
        }
      } else if (event.key === "Tab") {
        // Keep the focus inside the menu while it is open.
        event.preventDefault();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu, active, close]);

  if (!menu) return null;

  // Keep the menu on the screen: it flips to the other side near an edge.
  const width = 232;
  const height = menu.items.length * 38 + 12;
  const left = Math.min(menu.x, window.innerWidth - width - 12);
  const top = Math.min(menu.y, window.innerHeight - height - 12);

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Site menu"
      className="frosted fixed z-[95] min-w-[13rem] overflow-hidden rounded-2xl border border-sep p-1.5"
      style={{
        left: Math.max(12, left),
        top: Math.max(12, top),
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.14), inset 0 0 0 0.5px rgba(255,255,255,0.6)",
      }}
    >
      {menu.items.map((item, i) => {
        const { Icon } = item;
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            tabIndex={i === active ? 0 : -1}
            onMouseEnter={() => setActive(i)}
            onClick={() => {
              item.run();
              close();
            }}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-[14px] transition-colors ${
              i === active ? "bg-blue/10 text-ink" : "text-gray-2"
            }`}
          >
            <Icon size={16} weight="regular" className="shrink-0 text-blue" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
