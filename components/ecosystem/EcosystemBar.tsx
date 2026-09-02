import { Container } from '@/components/ui/Container';
import { EcosystemProjects } from '@/components/ecosystem/EcosystemProjects';
import { EcosystemApps } from '@/components/ecosystem/EcosystemApps';
import { EcosystemMenuBehavior } from '@/components/ecosystem/EcosystemMenuBehavior';

/**
 * The global HELPERG ecosystem bar.
 *
 * Rendered once, in the root layout, above `SiteHeader` — never per page. It
 * is a server component, so all 18 project links and all 14 app-store links
 * exist as real anchors in the server-rendered HTML of every public route.
 *
 * Structure is native `<details>`/`<summary>`, which gives keyboard operation,
 * an implicit expanded state, and correct behaviour with JavaScript disabled
 * for free. `EcosystemMenuBehavior` layers on Escape-to-close and
 * close-on-outside-interaction without owning the markup.
 *
 * Positioning: `sticky top-0` in normal document flow. The bar therefore
 * occupies real layout space and the site header sits immediately beneath it —
 * no fixed positioning, no compensating padding, and no top offsets to keep in
 * sync. `--ecosystem-bar-h` (styles/globals.css) exposes the height for the
 * few places that genuinely need it (anchor scroll-margin, the mobile search
 * panel), so the height is declared exactly once.
 */
export function EcosystemBar() {
  return (
    <nav
      aria-label="HELPERG Ecosystem"
      data-ecosystem-bar=""
      className="ecosystem-bar sticky top-0 z-[45] border-b border-forest-900/60 bg-forest-950 text-white/90"
    >
      <Container className="flex h-[var(--ecosystem-bar-h)] items-center gap-1">
        <span className="mr-auto truncate text-xs font-semibold tracking-wide text-white/95">
          HELPERG <span className="font-normal text-white/60">Ecosystem</span>
        </span>

        <EcosystemDisclosure
          id="ecosystem-projects-panel"
          label="Projects"
          wide
        >
          <EcosystemProjects />
        </EcosystemDisclosure>

        <EcosystemDisclosure id="ecosystem-apps-panel" label="Apps">
          <EcosystemApps />
        </EcosystemDisclosure>
      </Container>

      <EcosystemMenuBehavior />
    </nav>
  );
}

/**
 * One disclosure (trigger + panel).
 *
 * The panel is absolutely positioned so opening it never changes the height of
 * the sticky bar or shifts page content.
 */
function EcosystemDisclosure({
  id,
  label,
  wide = false,
  children,
}: {
  id: string;
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details data-ecosystem-panel="" className="group static sm:relative">
      <summary
        aria-controls={id}
        className="flex cursor-pointer list-none items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white [&::-webkit-details-marker]:hidden"
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="h-2.5 w-2.5 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </summary>

      <div
        id={id}
        className={[
          'absolute inset-x-0 top-full max-h-[calc(100vh-var(--ecosystem-bar-h)-1rem)] overflow-y-auto overscroll-contain border-b border-ink-100 bg-white p-3 text-ink-900 shadow-card',
          'sm:inset-x-auto sm:right-0 sm:mt-1 sm:rounded-lg sm:border',
          wide
            ? 'sm:w-[min(46rem,calc(100vw-2rem))]'
            : 'sm:w-[min(40rem,calc(100vw-2rem))]',
        ].join(' ')}
      >
        {children}
      </div>
    </details>
  );
}
