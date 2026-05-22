import { defaultCache } from "@serwist/next/worker";
import type {
  PrecacheEntry,
  RuntimeCaching,
  SerwistGlobalConfig,
} from "serwist";
import {
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const cacheStrategies: RuntimeCaching[] = [
  {
    matcher({ request }) {
      return ["style", "script", "image", "font"].includes(request.destination);
    },
    handler: new CacheFirst({
      cacheName: "runtime",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 1000,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        }),
      ],
    }),
  },
  {
    matcher({ request, url: { pathname }, sameOrigin }) {
      return (
        request.headers.get("Content-Type")?.includes("text/html") &&
        sameOrigin &&
        !pathname.startsWith("/api/")
      );
    },
    handler: new StaleWhileRevalidate({
      cacheName: "page",
      plugins: [new CacheableResponsePlugin({ statuses: [200] })],
    }),
  },
  {
    matcher({ url }) {
      return url.pathname.startsWith("/api/");
    },
    handler: new NetworkFirst({
      cacheName: "api",
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 60 * 5,
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...cacheStrategies, ...defaultCache],
});

serwist.addEventListeners();
