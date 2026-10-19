// Generates the VAPID key pair that web push needs.
//
//   node scripts/generate-vapid-keys.mjs
//
// Put the output in .env.local. The public key is safe to publish - the
// browser needs it. The PRIVATE key must not be committed and must be backed
// up: losing it invalidates every existing subscription, and every reader
// would have to turn notifications on again.
import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();

console.log("Add these to .env.local:\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log("VAPID_SUBJECT=mailto:contact@chouflimostakbel.tn");
console.log(`PUSH_SEND_SECRET=${process.env.PUSH_SEND_SECRET || "(pick a long random string)"}`);
console.log("\nThe public key is inlined into the client bundle at build time, so");
console.log("rebuild after changing it. Back the private key up with your other");
console.log("secrets - changing it silently turns off notifications for everyone.");
