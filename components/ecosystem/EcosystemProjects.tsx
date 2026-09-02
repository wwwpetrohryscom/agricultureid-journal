import {
  HELPERG_WEB_PROJECTS,
  isCurrentProject,
} from '@/lib/ecosystem/registry';

/**
 * The web-project list. Server component: every destination is a real,
 * server-rendered `<a href>` so the list is crawlable and works with
 * JavaScript disabled.
 *
 * Anchor text is the exact brand name and nothing else — no keyword-stuffed
 * phrases, no per-link descriptions. The category is rendered outside the
 * anchor purely as a visual grouping hint.
 */
export function EcosystemProjects() {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
      {HELPERG_WEB_PROJECTS.map((project) => {
        const current = isCurrentProject(project);
        return (
          <li key={project.id}>
            <a
              href={project.url}
              // The current site is a same-origin canonical link, so it opens
              // in place. Every other ecosystem destination is cross-origin.
              {...(current
                ? { 'aria-current': 'page' as const }
                : { target: '_blank', rel: 'noopener noreferrer' })}
              className="group flex items-baseline justify-between gap-3 rounded-md px-2 py-2 text-sm text-ink-700 transition-colors hover:bg-forest-50 hover:text-forest-900 focus-visible:bg-forest-50 sm:py-1.5"
            >
              <span className="font-medium">{project.name}</span>
              {current ? (
                <span className="shrink-0 rounded-full bg-forest-100 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-forest-800">
                  Current
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[0.6875rem] text-ink-400"
                >
                  {project.category}
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
