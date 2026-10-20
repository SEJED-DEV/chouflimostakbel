// Builds components/icons/data.ts from Font Awesome Free.
//
//   node scripts/build-icons.mjs     (npm run icons:build)
//
// The application asks for an icon by a friendly name - "house", "gear" -
// and this resolves that name against the Font Awesome package and writes
// out the path data plus the box it belongs in, so an icon costs a few
// hundred bytes at runtime rather than the whole library.
//
// Why a build step: the paths are long, they are easy to mistype by hand, and
// they are not ours to edit. Reading them from the package means an icon
// cannot drift from what Font Awesome actually ships.
//
// ---------------------------------------------------------------------------
// Why every icon carries its own viewBox
// ---------------------------------------------------------------------------
// Font Awesome does not use one grid. `bars` is `0 0 448 512`, `sun` is
// `0 0 576 512`, `xmark` is `0 0 384 512` - the box is always 512 tall and
// takes the glyph's own width. Emitting one hard-coded viewBox for everything
// would distort every icon whose box is not square.
//
// The set delivered with this platform's design is different again: it is
// drawn on a 640x640 grid whose 512-unit em-square sits at [64, 576]. Left
// under `0 0 640 640` those icons render at 80% the size of the ones read
// from the package - a 20% mismatch you would see immediately next to each
// other.
//
// So: package icons get the viewBox from their file, and delivered icons get
// one measured here - the smallest square that holds both the em-square and
// the ink. Nothing is assumed about a grid, and nothing can be clipped.
// Measuring rasterises the path (scripts using sharp is already how the PWA
// icon set is produced), because a correct bounding box over bezier curves
// needs the curve extrema, and hand-deriving those is exactly the kind of
// thing that is silently wrong.
//
// `PINNED` holds the set delivered with the platform's design. It is used
// verbatim rather than read from the package, and a difference is reported so
// a package upgrade that changes one of them is visible rather than silent.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PACK = join(ROOT, "node_modules", "@fortawesome", "fontawesome-free", "svgs");

/** The grid the delivered set was drawn on, and where its em-square sits. */
const DELIVERED_GRID = 640;
const EM = 64;
const EM_SIZE = 512;

/**
 * Friendly name -> where it lives in the package.
 *
 * `null` means there is no counterpart: the artwork was delivered for this
 * platform alone, so there is nothing to read and nothing to compare.
 *
 * `solid` and `brands` are the two that matter here: the interface is drawn
 * in one weight, and the social marks are their own family.
 */
const MANIFEST = {
  // --- The navigation ---------------------------------------------------
  house: "solid/house",
  signpost: "solid/signs-post",
  books: "solid/book-open",
  "graduation-cap": "solid/graduation-cap",
  newspaper: "solid/newspaper",
  "circle-user": "solid/circle-user",

  // --- Statements -------------------------------------------------------
  //
  // Font Awesome names these differently from the set this started on, so a
  // few keys are aliases. The key is what the application asks for; the path
  // is where Font Awesome actually keeps it.
  "arrow-right": "solid/arrow-right",
  "arrow-up-right": "solid/arrow-up-right-from-square",
  "external-link": "solid/square-arrow-up-right",
  "arrow-rotate-right": "solid/arrow-rotate-right",
  "caret-down": "solid/caret-down",
  check: "solid/check",
  xmark: "solid/xmark",
  plus: "solid/plus",
  minus: "solid/minus",
  copy: "solid/copy",
  download: "solid/download",
  share: "solid/share-nodes",
  wrench: "solid/wrench",
  search: "solid/magnifying-glass",

  // --- Feedback ---------------------------------------------------------
  bell: "solid/bell",
  globe: "solid/globe",
  moon: "solid/moon",
  sun: "solid/sun",
  "circle-info": "solid/circle-info",
  "circle-warning": "solid/circle-exclamation",
  "circle-check": "solid/circle-check",

  // --- Structure --------------------------------------------------------
  "square-plus": "solid/square-plus",
  "square-pen": "solid/square-pen",
  rocket: "solid/rocket",
  "right-from-bracket": "solid/right-from-bracket",
  bars: "solid/bars",

  // --- The platform's own ------------------------------------------------
  // The settings control, the roles, and the marks a profile carries.
  // These are the names `lib/roles.ts` asks for, so a role and its badge
  // agree on a word rather than on a Font Awesome file name.
  gear: "solid/gear",
  // Drawn for this platform: there is no Font Awesome counterpart, so there
  // is nothing to read it from and nothing to compare it against.
  leadership: null,
  dev: "solid/code",
  staff: "solid/user-shield",
  secret: "solid/user-secret",
  star: "solid/star",
  user: "solid/user",

  // --- Brand marks -------------------------------------------------------
  github: "brands/github",
  facebook: "brands/facebook",
  linkedin: "brands/linkedin",
  instagram: "brands/instagram",
  google: "brands/google",
};

/**
 * The set delivered with this platform's design, as it was given to us.
 *
 * Used verbatim. If the package disagrees, the difference is printed rather
 * than quietly applied - an icon changing shape under a badge nobody expects
 * it to change is worse than an outdated path.
 *
 * `leadership` has no package entry at all: it was drawn for this platform,
 * so it is delivered-only and is compared against nothing.
 */
const PINNED = {
  gear:
    "M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z",
  star:
    "M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z",
  leadership:
    "M372.2 116C372.2 136.9 359.8 155 342 163.2L448 256L552.4 235.1C547.1 227.4 544 218 544 208C544 181.5 565.5 160 592 160C618.5 160 640 181.5 640 208C640 234 619.4 255.1 593.6 256L481 506.3C470.7 529.3 447.8 544 422.6 544L217.4 544C192.2 544 169.4 529.2 159 506.3L46.4 256C20.6 255.1 0 234 0 208C0 181.5 21.5 160 48 160C74.5 160 96 181.5 96 208C96 218.1 92.9 227.4 87.6 235.1L192 256L298.1 163.1C280.4 154.8 268.1 136.8 268.1 116C268.1 87.3 291.4 64 320.1 64C348.8 64 372.1 87.3 372.1 116L372.2 116z",
  dev:
    "M392.8 65.2C375.8 60.3 358.1 70.2 353.2 87.2L225.2 535.2C220.3 552.2 230.2 569.9 247.2 574.8C264.2 579.7 281.9 569.8 286.8 552.8L414.8 104.8C419.7 87.8 409.8 70.1 392.8 65.2zM457.4 201.3C444.9 213.8 444.9 234.1 457.4 246.6L530.8 320L457.4 393.4C444.9 405.9 444.9 426.2 457.4 438.7C469.9 451.2 490.2 451.2 502.7 438.7L598.7 342.7C611.2 330.2 611.2 309.9 598.7 297.4L502.7 201.4C490.2 188.9 469.9 188.9 457.4 201.4zM182.7 201.3C170.2 188.8 149.9 188.8 137.4 201.3L41.4 297.3C28.9 309.8 28.9 330.1 41.4 342.6L137.4 438.6C149.9 451.1 170.2 451.1 182.7 438.6C195.2 426.1 195.2 405.8 182.7 393.3L109.3 320L182.6 246.6C195.1 234.1 195.1 213.8 182.6 201.3z",
  user:
    "M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z",
  secret:
    "M267 48C230.6 48 209.2 106.3 198.7 160L168 160C154.7 160 144 170.7 144 184C144 197.3 154.7 208 168 208L192 208L192 240C192 257 195.3 273.2 201.3 288L192 288L192 288L171.5 288C156.3 288 144 300.3 144 315.5C144 318.5 144.5 321.4 145.4 324.2L174.3 410.8C136.2 443.6 112 492.1 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 492.1 503.8 443.6 465.7 410.9L494.6 324.3C495.5 321.5 496 318.6 496 315.6C496 300.4 483.7 288.1 468.5 288.1L448 288.1L448 288.1L438.7 288.1C444.7 273.3 448 257.1 448 240.1L448 208.1L472 208.1C485.3 208.1 496 197.4 496 184.1C496 170.8 485.3 160.1 472 160.1L441.3 160.1C430.9 106.4 409.4 48.1 373 48.1C363.4 48.1 354 52 345.5 56.3C337.3 60.4 327.1 64.1 320 64.1C312.9 64.1 302.7 60.4 294.5 56.3C286 51.9 276.6 48 267 48zM360.7 532.4L335.9 461.5L363.8 429C366.5 425.8 368 421.8 368 417.6C368 407.9 360.2 400.1 350.5 400.1L289.5 400.1C279.8 400.1 272 407.9 272 417.6C272 421.8 273.5 425.8 276.2 429L304.1 461.5L279.3 532.4L222.3 352L258 352C276.4 362.2 297.5 368 320 368C342.5 368 363.6 362.2 382 352L417.7 352L360.7 532.4zM320 320C285.3 320 255.8 297.9 244.7 267C250.4 270.2 257 272 264 272L276.4 272C292.9 272 307.5 261.4 312.7 245.8C315 238.8 324.9 238.8 327.2 245.8C332.4 261.4 347.1 272 363.5 272L375.9 272C382.9 272 389.5 270.2 395.2 267C384.1 297.9 354.6 320 319.9 320z",
  staff:
    "M320 312C253.7 312 200 258.3 200 192C200 125.7 253.7 72 320 72C386.3 72 440 125.7 440 192C440 258.3 386.3 312 320 312zM289.5 368L350.5 368C360.2 368 368 375.8 368 385.5C368 389.7 366.5 393.7 363.8 396.9L336.4 428.9L367.4 544L368 544L402.6 405.5C404.8 396.8 413.7 391.5 422.1 394.7C484 418.3 528 478.3 528 548.5C528 563.6 515.7 575.9 500.6 575.9L139.4 576C124.3 576 112 563.7 112 548.6C112 478.4 156 418.4 217.9 394.8C226.3 391.6 235.2 396.9 237.4 405.6L272 544.1L272.6 544.1L303.6 429L276.2 397C273.5 393.8 272 389.8 272 385.6C272 375.9 279.8 368.1 289.5 368.1z",
  house:
    "M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z",
  "circle-user":
    "M463 448.2C440.9 409.8 399.4 384 352 384L288 384C240.6 384 199.1 409.8 177 448.2C212.2 487.4 263.2 512 320 512C376.8 512 427.8 487.3 463 448.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 336C359.8 336 392 303.8 392 264C392 224.2 359.8 192 320 192C280.2 192 248 224.2 248 264C248 303.8 280.2 336 320 336z",
  github:
    "M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z",
  facebook:
    "M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z",
  linkedin:
    "M512 96L127.9 96C110.3 96 96 110.5 96 128.3L96 511.7C96 529.5 110.3 544 127.9 544L512 544C529.6 544 544 529.5 544 511.7L544 128.3C544 110.5 529.6 96 512 96zM231.4 480L165 480L165 266.2L231.5 266.2L231.5 480L231.4 480zM198.2 160C219.5 160 236.7 177.2 236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160zM480.3 480L413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480z",
  instagram:
    "M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z",
  google:
    "M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z",
  bars:
    "M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z",
  "circle-info":
    "M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z",
};

/** Pull the path data out of an SVG file. */
function pathFrom(file) {
  const svg = readFileSync(file, "utf8");
  const d = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  if (d.length === 0) throw new Error(`no path in ${file}`);
  return d.join(" ");
}

/** The viewBox Font Awesome ships with an icon. */
function viewBoxFrom(file) {
  const vb = readFileSync(file, "utf8").match(/viewBox="([^"]+)"/);
  if (!vb) throw new Error(`no viewBox in ${file}`);
  return vb[1];
}

const RASTER = 256;

/**
 * Ink bounds of a path, in its own coordinate space.
 *
 * Rasterised rather than computed: a bounding box over bezier curves needs
 * the curve extrema, and deriving them by hand is the kind of thing that is
 * quietly wrong in a way nobody notices until an icon is clipped.
 *
 * The space is always square here (the delivered grid is 640x640), so a
 * square canvas gives a uniform scale. A non-square space would need a
 * matching canvas - letterboxing it would under-report the width.
 */
async function inkBounds(d, space) {
  const UPP = space / RASTER;
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${space} ${space}" ` +
      `width="${RASTER}" height="${RASTER}"><path fill="#fff" d="${d}"/></svg>`,
  );
  const { data, info } = await sharp(svg).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = RASTER, minY = RASTER, maxX = -1, maxY = -1;
  for (let y = 0; y < RASTER; y++) {
    for (let x = 0; x < RASTER; x++) {
      if (data[(y * RASTER + x) * info.channels + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error("path rendered to nothing");
  return { x: minX * UPP, y: minY * UPP, w: (maxX - minX + 1) * UPP, h: (maxY - minY + 1) * UPP };
}

/**
 * The box a delivered icon should be read in: the smallest square that holds
 * both its em-square and its ink.
 *
 * Holding the em-square as well as the ink is what keeps the delivered set on
 * the same optical footing as the package - an icon with a small glyph still
 * gets the padding it was drawn with, rather than being blown up to fill the
 * frame.
 */
function deliveredViewBox(b) {
  let x0 = Math.min(EM, b.x);
  let x1 = Math.max(EM + EM_SIZE, b.x + b.w);
  let y0 = Math.min(EM, b.y);
  let y1 = Math.max(EM + EM_SIZE, b.y + b.h);

  const side = Math.max(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  x0 = cx - side / 2;
  y0 = cy - side / 2;

  // Three decimals is well past what a rendered pixel can show, and it keeps
  // the generated file free of 47-decimal-place noise.
  const n = (v) => +v.toFixed(3);
  return `${n(x0)} ${n(y0)} ${n(side)} ${n(side)}`;
}

const out = {};
const problems = [];
const notices = [];

for (const [name, rel] of Object.entries(MANIFEST)) {
  const file = rel ? join(PACK, `${rel}.svg`) : null;
  const hasPackage = file && existsSync(file);

  if (file && !hasPackage) {
    problems.push(`  ${name}: ${rel}.svg is not in the package`);
    continue;
  }

  const pinned = PINNED[name];

  if (pinned) {
    out[name] = { d: pinned, viewBox: deliveredViewBox(await inkBounds(pinned, DELIVERED_GRID)) };
    if (hasPackage && pinned !== pathFrom(file)) {
      notices.push(
        `  ${name}: the package has changed since this set was delivered.\n` +
          `     kept the delivered path; the package's differs.`,
      );
    }
    continue;
  }

  if (!hasPackage) {
    problems.push(`  ${name}: delivered artwork is missing and there is no package file`);
    continue;
  }

  out[name] = { d: pathFrom(file), viewBox: viewBoxFrom(file) };
}

// Anything delivered but never asked for is dead weight in the file, and it
// almost always means a rename was missed somewhere.
for (const name of Object.keys(PINNED)) {
  if (!(name in MANIFEST)) problems.push(`  ${name}: delivered artwork is not in the manifest`);
}

const names = Object.keys(out).sort();
const delivered = Object.keys(PINNED).sort();
const version = JSON.parse(
  readFileSync(join(ROOT, "node_modules", "@fortawesome", "fontawesome-free", "package.json"), "utf8"),
).version;

if (problems.length) {
  console.error(`Icon problems:\n${problems.join("\n")}`);
  process.exit(1);
}

if (notices.length) {
  // One differing icon after a package upgrade is worth spelling out. All
  // but one differing is the delivered set simply being a different release,
  // which is known and expected - so it is summarised instead of printed as
  // a wall that hides the case that matters.
  if (notices.length <= 3) {
    console.log(`Note:\n${notices.join("\n")}\n`);
  } else {
    console.log(
      `Note: ${notices.length} of ${delivered.length} delivered icons differ from ` +
        `Font Awesome Free ${version}.\n` +
        `      The delivered paths are used and the package is not applied.\n` +
        `      Rerun with the count below 4 to see them individually.\n` +
        `      ${Object.keys(PINNED).sort().join(", ")}\n`,
    );
  }
}

const header = `// GENERATED by scripts/build-icons.mjs - do not edit by hand.
// Run \`npm run icons:build\` after changing the manifest or the delivered set.
//
// Path data from Font Awesome Free ${version} (icons: CC BY 4.0,
// https://creativecommons.org/licenses/by/4.0/).
//
// Each glyph carries the box it belongs in. Font Awesome does not use one
// grid - the box height is 512 but the width follows the glyph - and the
// delivered set is on a 640 grid again, so a single hard-coded viewBox would
// distort most of them.

export type IconName = ${names.map((n) => `"${n}"`).join(" | ")};

export interface Glyph {
  /** The path, in \`viewBox\` coordinates. */
  readonly d: string;
  /** The coordinate space \`d\` is drawn in. */
  readonly viewBox: string;
}

/** Delivered with this platform's design; used verbatim, never from the package. */
export const DELIVERED: readonly IconName[] = ${JSON.stringify(delivered, null, 2)};

export const ICONS: Record<IconName, Glyph> = ${JSON.stringify(out, null, 2)};
`;

const dir = join(ROOT, "components", "icons");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "data.ts"), header, "utf8");

console.log(`components/icons/data.ts: ${names.length} icons (${delivered.length} delivered)`);
