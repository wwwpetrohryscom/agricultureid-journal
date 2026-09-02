import { HELPERG_APPS, appStoreLinks } from '@/lib/ecosystem/registry';

/**
 * The mobile-app list. Server component: every store destination is a real,
 * server-rendered `<a href>`.
 *
 * Apps published on one platform only render one link — there is no
 * placeholder or invented URL for the missing platform. Store links use plain
 * text labels rather than Apple/Google badge artwork, which is subject to
 * their brand terms.
 */
export function EcosystemApps() {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
      {HELPERG_APPS.map((app) => (
        <li key={app.id} className="px-2 py-2 sm:py-1.5">
          <p className="text-sm font-medium text-ink-800">{app.name}</p>
          <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
            {appStoreLinks(app).map((store) => (
              <a
                key={store.platform}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded text-xs text-forest-700 underline-offset-2 transition-colors hover:text-forest-900 hover:underline focus-visible:underline"
              >
                <span className="sr-only">{app.name} on </span>
                {store.label}
              </a>
            ))}
          </p>
        </li>
      ))}
    </ul>
  );
}
