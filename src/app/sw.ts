/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import {
  Serwist,
  CacheFirst,
  type PrecacheEntry,
  type SerwistGlobalConfig,
  type RuntimeCaching,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const extraRuntimeCaching: RuntimeCaching[] = [
  {
    matcher: ({ request }) => request.destination === "audio",
    handler: new CacheFirst({ cacheName: "audio-cache" }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...defaultCache, ...extraRuntimeCaching],
});

serwist.addEventListeners();
