// @ts-check
// Service worker build (Serwist configurator mode, roadmap 3.9).
// `next build` (Turbopack) can't run webpack plugins, so the worker is built after it:
//   pnpm build  →  next build && serwist build
// See https://serwist.pages.dev/docs/next/config
import { spawnSync } from "node:child_process";
import { serwist } from "@serwist/next/config";

// Revision for extra precached pages, so a new deploy replaces the old offline page.
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  crypto.randomUUID();

export default serwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Pages are per-user and rendered on the client; precaching prerendered HTML adds nothing.
  precachePrerendered: false,
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});
