// Announces a new version to everyone who turned on update alerts.
//
//   npm run notify:push              announce the newest release
//   npm run notify:push -- --dry-run show what would be sent, send nothing
//   npm run notify:push -- --force   send even if this version was announced
//
// The notification is sent in all three languages at once. The service worker
// picks the one matching the reader's saved language.
//
// Announced once per version: the store remembers the last version announced,
// so deploying five times in a day does not ping anyone five times. Use
// --force to override that.
import { changelog } from "../components/i18n/changelog.ts";
import { push as pushCopy } from "../components/i18n/push.ts";
import { getStore, isPushConfigured, sendOnce, sendToAll } from "../lib/push.ts";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");

if (!isPushConfigured()) {
  console.error(
    "Push is not configured.\n" +
      "  Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env.local.\n" +
      "  Generate a pair with: node scripts/generate-vapid-keys.mjs",
  );
  process.exit(1);
}

const entry = changelog.en.entries[0];
if (!entry) {
  console.error("No changelog entries found.");
  process.exit(1);
}

const version = entry.version;

const payload = {
  version,
  url: "/changelog",
  title: {
    en: pushCopy.en.updatedTitle,
    fr: pushCopy.fr.updatedTitle,
    ar: pushCopy.ar.updatedTitle,
  },
  body: {
    en: changelog.en.entries[0].summary,
    fr: changelog.fr.entries[0].summary,
    ar: changelog.ar.entries[0].summary,
  },
};

const subscribers = (await getStore().list()).length;

console.log(`Version:    ${version}`);
console.log(`Subscribers: ${subscribers}`);
console.log(`Title (en): ${payload.title.en}`);
console.log(`Body  (en): ${payload.body.en}`);
console.log("");

if (dryRun) {
  console.log("Dry run - nothing was sent.");
  process.exit(0);
}

if (force) {
  const result = await sendToAll(payload);
  console.log(`Sent to ${result.sent}, failed ${result.failed}, removed ${result.removed}.`);
  process.exit(0);
}

const { sent, result } = await sendOnce(version, payload);

if (!sent) {
  console.log(`${version} was already announced. Nothing sent. Use --force to send again.`);
  process.exit(0);
}

console.log(
  `Announced ${version}: sent to ${result.sent}, failed ${result.failed}, removed ${result.removed}.`,
);
