// THE PHONE LAUNCHER IS LOCKED (owner, 2026-10-27: "launcher na code ne lockdown ma nakh, koi call na kari shake; jyare hu kaish 'unlock launcher' tyare j").
// The launcher is the phone home screen of src/components/site/mobile/launcher*.tsx (page src/app/(m)/m/page.tsx). While this is false:
//   - the address "/" is never rewritten to it (src/lib/device.ts): a phone or tablet gets the normal home page, made responsive;
//   - the address /m itself sends the visitor to "/" (src/app/(m)/m/page.tsx);
// and nothing else can reach the launcher. The code stays in the repository, unchanged.
// TO UNLOCK (only when the owner says "unlock launcher"): change false to true, nothing else.
export const LAUNCHER_UNLOCKED = false;
