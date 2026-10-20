// Regenerates the web push key pair and writes it into .env.local.
//
//   node scripts/regenerate-vapid.mjs
//
// The old pair is replaced, which invalidates every existing subscription:
// a subscription is signed with the key that created it, so readers would have
// to turn notifications on again. That is why the key is worth backing up.
import webpush from "web-push";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const keys = webpush.generateVAPIDKeys();
const FILE = ".env.local";

let s = existsSync(FILE) ? readFileSync(FILE, "utf8") : "";

function set(key, value) {
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, "m").test(s)) {
    s = s.replace(new RegExp(`^${key}=.*$`, "m"), line);
  } else {
    s = s.trimEnd() + `\n${line}\n`;
  }
}

set("NEXT_PUBLIC_VAPID_PUBLIC_KEY", keys.publicKey);
set("VAPID_PRIVATE_KEY", keys.privateKey);

writeFileSync(FILE, s, "utf8");

console.log("New key pair written to .env.local:");
console.log("  NEXT_PUBLIC_VAPID_PUBLIC_KEY=" + keys.publicKey);
console.log("  VAPID_PRIVATE_KEY=" + keys.privateKey);
console.log("\nAnyone who had notifications on will have to turn them on again:");
console.log("a subscription is signed with the key that made it, and this is a");
console.log("different key. Back the new private key up - losing it does it again.");
