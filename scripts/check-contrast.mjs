// Contrast audit.
//
//   node scripts/check-contrast.mjs [url]
//
// A MANUAL tool, not a gate. It is good at finding real problems - it is how
// the white-buttons-with-white-text bug was found - but it cannot read a
// background image, so text sitting on a photograph is reported as unreadable
// when it is not. Read the findings before believing them.
//
// Walks every page, resolves the real colours out of the built stylesheet,
// and reports any text whose contrast against its background falls below the
// WCAG AA threshold. Light and dark are both checked, because a token can
// flip and leave one of them unreadable.
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/+$/, "");

const PAGES = [
  "/",
  "/about",
  "/dropouts",
  "/divisions",
  "/graduates",
  "/changelog",
  "/soon",
  "/contact",
  "/privacy",
  "/terms",
];

/** WCAG AA: 4.5 for normal text, 3 for large (18.66px bold or 24px). */
const NORMAL = 4.5;
const LARGE = 3;

function srgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function luminance(hex) {
  const [r, g, b] = srgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Mix a translucent colour over an opaque one. */
function mix(fg, alpha, bg) {
  const f = srgb(fg);
  const b = srgb(bg);
  const out = f.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)));
  return "#" + out.map((v) => v.toString(16).padStart(2, "0")).join("");
}

/* ---- The stylesheet ---- */

const home = await (await fetch(BASE + "/")).text();
const cssPath = (home.match(/\/_next\/static\/css\/[^"]+\.css/) || [])[0];
if (!cssPath) {
  console.error("No stylesheet found at " + BASE);
  process.exit(1);
}
const css = await (await fetch(BASE + cssPath)).text();

/** class name -> { property: raw value } for every utility in the sheet. */
const utilities = new Map();
for (const m of css.matchAll(/\.([a-zA-Z0-9_\\:\/\[\]\.\-%]+)\{([^}]*)\}/g)) {
  const name = m[1].replace(/\\/g, "");
  if (!/^[a-z]/.test(name)) continue;
  const decls = {};
  for (const d of m[2].matchAll(/([a-z-]+)\s*:\s*([^;]+)/g)) decls[d[1]] = d[2].trim();
  if (!utilities.has(name)) utilities.set(name, decls);
}

/** The theme tokens, per colour scheme. */
function tokens(selector) {
  const at = css.indexOf(selector);
  if (at === -1) return {};
  const block = css.slice(at, css.indexOf("}", at));
  const out = {};
  for (const m of block.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;]+)/g)) out[m[1]] = m[2].trim();
  return out;
}

const LIGHT = tokens(":root");
const DARK = tokens(".dark");

function resolve(value, scheme) {
  if (!value) return null;
  let v = value.trim();

  // var(--color-ink) and friends
  const varMatch = v.match(/^var\(--color-([a-z0-9-]+)\)$/);
  if (varMatch) {
    const raw = (scheme === "dark" ? DARK : LIGHT)[varMatch[1]];
    if (!raw) return null;
    v = raw.trim();
  }

  // A literal colour, possibly with an alpha modifier: #0071e3 or #0071e366
  if (v.startsWith("#")) {
    const hex = v.slice(1);
    const body = hex.length === 3 || hex.length === 6 ? hex : hex.slice(0, 6);
    const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { hex: "#" + body, alpha };
  }
  if (v === "white" || v === "#fff") return { hex: "#ffffff", alpha: 1 };
  if (v === "black" || v === "#000") return { hex: "#000000", alpha: 1 };
  if (v.startsWith("rgb")) {
    const nums = v.match(/[\d.]+/g) || [];
    const hex =
      "#" +
      [0, 1, 2]
        .map((i) => Number(nums[i] || 0).toString(16).padStart(2, "0"))
        .join("");
    const alpha = nums[3] !== undefined ? Number(nums[3]) : 1;
    return { hex, alpha };
  }
  return null;
}

/** The colour a class contributes, for a given scheme. */
function colourOf(classes, property, scheme) {
  let found = null;
  for (const cls of classes) {
    const decls = utilities.get(cls);
    if (!decls) continue;
    const raw = decls[property];
    if (!raw) continue;
    const resolved = resolve(raw, scheme);
    if (resolved) found = resolved;
  }
  return found;
}

/* ---- The pages ---- */

/** Elements that never have a closing tag. */
const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/** A crude element tree: enough to walk up for the background. */
function parseElements(html) {
  const stack = [];
  const elements = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[5] !== undefined) {
      if (stack.length) {
        const top = stack[stack.length - 1];
        top.text += m[5];
      }
      continue;
    }
    const [, closing, tag, attrs, selfClose] = m;
    if (closing) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || "";
    const el = {
      tag,
      classes: cls.split(/\s+/).filter(Boolean),
      style: attrs.match(/style="([^"]*)"/)?.[1] || "",
      text: "",
      parent: stack.length ? stack[stack.length - 1] : null,
    };
    elements.push(el);
    // A void element is never pushed, or it would swallow everything after it.
    if (!selfClose && !VOID.has(tag.toLowerCase())) stack.push(el);
  }
  return elements;
}

const findings = [];

for (const path of PAGES) {
  let html;
  try {
    const r = await fetch(BASE + path);
    if (!r.ok) continue;
    html = await r.text();
  } catch {
    continue;
  }

  const elements = parseElements(html);

  for (const scheme of ["light", "dark"]) {
    // Resolve each element's effective background by walking up.
    const bgOf = (el) => {
      let node = el;
      let overlay = null;
      while (node) {
        const c = colourOf(node.classes, "background-color", scheme);
        if (c) {
          overlay = overlay
            ? { hex: mix(overlay.hex, overlay.alpha, c.hex), alpha: 1 }
            : c;
          if (overlay.alpha >= 1) return overlay.hex;
        }
        node = node.parent;
      }
      // The page background.
      const root = colourOf(["bg-bg"], "background-color", scheme);
      const base = root ? root.hex : "#ffffff";
      return overlay ? mix(overlay.hex, overlay.alpha, base) : base;
    };

    for (const el of elements) {
      const own = colourOf(el.classes, "color", scheme);
      if (!own) continue;
      const text = el.text.replace(/\s+/g, " ").trim();
      if (!text) continue;
      // Only text-bearing leaf-ish elements matter.
      if (text.length > 120) continue;

      // Text sitting on a background image cannot be judged from the
      // stylesheet alone - the image decides the contrast, not a colour.
      let node = el;
      let onImage = false;
      while (node) {
        if (colourOf(node.classes, "background-image", scheme)) {
          onImage = true;
          break;
        }
        node = node.parent;
      }
      if (onImage) continue;

      const bg = bgOf(el);
      const fg = own.alpha < 1 ? mix(own.hex, own.alpha, bg) : own.hex;

      // Large text: 24px, or 18.66px and bold.
      const size = parseFloat((el.classes.find((c) => /^text-\[/.test(c)) || "").match(/text-\[([\d.]+)px\]/)?.[1] || "16");
      const bold = el.classes.some((c) => c === "font-semibold" || c === "font-bold" || c === "font-medium");
      const isLarge = size >= 24 || (size >= 18.66 && bold);
      const threshold = isLarge ? LARGE : NORMAL;

      const ratio = contrast(fg, bg);
      if (ratio < threshold) {
        findings.push({
          path,
          scheme,
          ratio: ratio.toFixed(2),
          need: threshold,
          fg,
          bg,
          text: text.slice(0, 48),
          classes: el.classes.filter((c) => /^(bg|text)-/.test(c)).join(" "),
        });
      }
    }
  }
}

// Report
const seen = new Set();
const unique = findings.filter((f) => {
  const key = f.scheme + f.classes + f.text;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

if (unique.length === 0) {
  console.log(`No contrast problems found across ${PAGES.length} pages, light and dark.`);
} else {
  console.log(`${unique.length} contrast problem(s):\n`);
  for (const f of unique) {
    console.log(`  [${f.scheme}] ${f.ratio}:1 (needs ${f.need}) on ${f.path}`);
    console.log(`    text "${f.text}"`);
    console.log(`    ${f.fg} on ${f.bg}  |  ${f.classes}\n`);
  }
  process.exit(1);
}
