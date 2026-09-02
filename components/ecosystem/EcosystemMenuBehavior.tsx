'use client';

import { useEffect } from 'react';

/**
 * Progressive enhancement for the ecosystem disclosures.
 *
 * The bar is fully functional without this component: it is built from native
 * `<details>`/`<summary>`, so it opens, closes, and is keyboard operable with
 * JavaScript disabled, and every link is present in the server-rendered HTML.
 *
 * This adds only the two behaviours native `<details>` lacks:
 *   1. Escape closes the open panel and returns focus to its summary.
 *   2. Opening one panel closes the other, and a click/focus outside closes
 *      whichever is open.
 *
 * It carries NO registry data, so nothing from `lib/ecosystem/registry` is
 * pulled into the client bundle by this file. It renders nothing.
 */
export function EcosystemMenuBehavior() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-ecosystem-bar]');
    if (!root) return;

    const panels = Array.from(
      root.querySelectorAll<HTMLDetailsElement>(
        'details[data-ecosystem-panel]',
      ),
    );
    if (panels.length === 0) return;

    const close = (d: HTMLDetailsElement) => {
      d.open = false;
    };

    // Only one panel open at a time.
    const onToggle = (event: Event) => {
      const opened = event.currentTarget as HTMLDetailsElement;
      if (!opened.open) return;
      for (const other of panels) if (other !== opened) close(other);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const open = panels.find((d) => d.open);
      if (!open) return;
      close(open);
      // Return focus to the trigger so the keyboard user is not stranded.
      open.querySelector<HTMLElement>('summary')?.focus();
    };

    // `focusin` covers keyboard tabbing out; `pointerdown` covers mouse/touch.
    const onOutside = (event: Event) => {
      const target = event.target as Node | null;
      if (target && root.contains(target)) return;
      for (const d of panels) if (d.open) close(d);
    };

    for (const d of panels) d.addEventListener('toggle', onToggle);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);

    return () => {
      for (const d of panels) d.removeEventListener('toggle', onToggle);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, []);

  return null;
}
