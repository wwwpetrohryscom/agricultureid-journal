/**
 * HELPERG ecosystem — the single canonical registry.
 *
 * This is the ONLY place ecosystem destinations are declared. The bar, the
 * expandable panel, and every future surface read from here, so a project is
 * added, renamed, or re-linked in exactly one file. Do not re-declare these
 * links in desktop nav, mobile nav, or the footer.
 *
 * DELIBERATELY DEPENDENCY-FREE. This module imports nothing — not even
 * `@/lib/site`. The ecosystem UI is partly client-rendered, and in this
 * repository the content/SEO modules transitively pull the whole generated
 * content layer (~13 MB under `content/`). A client component importing any of
 * that drags it into the browser bundle. Keeping this file import-free means it
 * is safe from both server and client components. Keep it that way.
 *
 * The data is static, trusted, in-repo code. Nothing here is ever derived from
 * user input, and `scripts/ecosystem-validate.ts` enforces the invariants
 * (HTTPS, well-formed URLs, unique ids, unique URLs, non-empty names, known
 * store hosts) at build time.
 */

/** A HELPERG web property. */
export interface EcosystemWebProject {
  /** Stable, unique, kebab-case identifier. */
  id: string;
  /** Exact public brand name. Used verbatim as the link's anchor text. */
  name: string;
  /** Canonical absolute HTTPS URL. */
  url: string;
  /** Short grouping label. Never rendered inside the anchor text. */
  category?: string;
}

/** Mobile app store platforms. */
export type AppPlatform = 'ios' | 'android';

/** A HELPERG mobile app and the stores it is published on. */
export interface EcosystemApp {
  /** Stable, unique, kebab-case identifier. */
  id: string;
  /** Exact public app name. */
  name: string;
  /**
   * Store links. A platform is present only when an official URL exists.
   * Never invent a missing platform URL — absence is meaningful.
   */
  platforms: {
    ios?: string;
    android?: string;
  };
}

/**
 * The canonical origin of this site. Used to mark the current product in the
 * ecosystem list. Kept as a literal (not imported from `@/lib/site`) so this
 * module stays dependency-free; `tests/ecosystem.test.ts` asserts the two
 * agree, so they can never silently drift.
 */
export const CURRENT_PROJECT_ID = 'agricultureid';

/**
 * Every HELPERG web project, in the order shown in the panel.
 * URLs are canonical and exact — do not normalise, strip `www.`, or "tidy"
 * them; they are the addresses the brand publishes.
 */
export const HELPERG_WEB_PROJECTS: readonly EcosystemWebProject[] = [
  {
    id: 'helperg',
    name: 'HELPERG',
    url: 'https://helperg.com',
    category: 'Hub',
  },
  {
    id: 'webmasterid',
    name: 'WebmasterID',
    url: 'https://webmasterid.com',
    category: 'Analytics',
  },
  {
    id: 'cash-workspace',
    name: 'Cash Workspace',
    url: 'https://www.cashworkspace.com',
    category: 'Finance',
  },
  {
    id: 'twin-phone',
    name: 'Twin Phone',
    url: 'https://twin-phone.com',
    category: 'Communication',
  },
  {
    id: 'talentpartnerid',
    name: 'TalentPartnerID',
    url: 'https://talentpartnerid.com',
    category: 'Recruiting',
  },
  {
    id: 'hrhelperg',
    name: 'HRHelperG',
    url: 'https://hrhelperg.com',
    category: 'HR',
  },
  {
    id: 'geobusinessiq',
    name: 'GeoBusinessIQ',
    url: 'https://geobusinessiq.com',
    category: 'Business',
  },
  {
    id: 'global-city-intelligence',
    name: 'Global City Intelligence',
    url: 'https://globalcityintelligence.com',
    category: 'Cities',
  },
  {
    id: 'socialsporthub',
    name: 'SocialSportHub',
    url: 'https://socialsporthub.com',
    category: 'Sport',
  },
  {
    id: 'agricultureid',
    name: 'AgricultureID',
    url: 'https://agricultureid.com',
    category: 'Agriculture',
  },
  {
    id: 'faunahub',
    name: 'FaunaHub',
    url: 'https://faunahub.com',
    category: 'Wildlife',
  },
  {
    id: 'builddesignhub',
    name: 'BuildDesignHub',
    url: 'https://builddesignhub.com',
    category: 'Construction',
  },
  {
    id: 'printerarchive',
    name: 'PrinterArchive',
    url: 'https://printerarchive.net',
    category: 'Hardware',
  },
  {
    id: 'virtue-and-power',
    name: 'Virtue & Power',
    url: 'https://virtueandpower.com',
    category: 'Culture',
  },
  {
    id: 'asteriastar',
    name: 'AsteriaStar',
    url: 'https://asteriastar.com',
    category: 'Astronomy',
  },
  {
    id: 'petro-hrys',
    name: 'Petro Hrys',
    url: 'https://petrohrys.com',
    category: 'Personal',
  },
  {
    id: 'pdf-edit-convert',
    name: 'PDF Edit & Convert',
    url: 'https://pdfeditconvert.top',
    category: 'Documents',
  },
  {
    id: 'esimky',
    name: 'eSIMky',
    url: 'https://esimky.com',
    category: 'Connectivity',
  },
] as const;

/**
 * Every HELPERG mobile app.
 *
 * Some apps ship on one platform only. `cv-resume` and `twin-phone` have no
 * official Android URL, so they have no `android` key. Do NOT add a guessed
 * Play Store URL to "complete" them — `scripts/ecosystem-validate.ts` and
 * `tests/ecosystem.test.ts` both assert those two remain iOS-only.
 */
export const HELPERG_APPS: readonly EcosystemApp[] = [
  {
    id: 'zip',
    name: 'Zip',
    platforms: {
      ios: 'https://apps.apple.com/app/id6753772583',
      android:
        'https://play.google.com/store/apps/details?id=com.ziparchivator.zip&pcampaignid=web_share',
    },
  },
  {
    id: 'printer',
    name: 'Printer',
    platforms: {
      ios: 'https://apps.apple.com/app/id6746067890',
      android:
        'https://play.google.com/store/apps/details?id=com.helperg.smart.printer',
    },
  },
  {
    id: 'fax',
    name: 'Fax',
    platforms: {
      ios: 'https://apps.apple.com/app/id6760895885',
      android:
        'https://play.google.com/store/apps/details?id=com.helperg.fax.app&pcampaignid=web_share',
    },
  },
  {
    id: 'pdf',
    name: 'PDF',
    platforms: {
      ios: 'https://apps.apple.com/app/id6747341672',
      android:
        'https://play.google.com/store/apps/details?id=com.helperg.editor.documents&pcampaignid=web_share',
    },
  },
  {
    id: 'cv-resume',
    name: 'CV Resume',
    // iOS only — no official Android release supplied.
    platforms: { ios: 'https://apps.apple.com/app/id6745150815' },
  },
  {
    id: 'invoice-maker',
    name: 'Invoice Maker',
    platforms: {
      ios: 'https://apps.apple.com/app/id6747311276',
      android:
        'https://play.google.com/store/apps/details?id=com.helperg.invoicer',
    },
  },
  {
    id: 'pocket-manager',
    name: 'Pocket Manager',
    platforms: {
      ios: 'https://apps.apple.com/app/id6743084126',
      android:
        'https://play.google.com/store/apps/details?id=com.helperg.money',
    },
  },
  {
    id: 'twin-phone',
    name: 'Twin Phone',
    // iOS only — no official Android release supplied.
    platforms: { ios: 'https://apps.apple.com/app/id6792280945' },
  },
] as const;

/** Human-readable store labels. Neutral text — no Apple/Google artwork. */
export const PLATFORM_LABELS: Record<AppPlatform, string> = {
  ios: 'App Store',
  android: 'Google Play',
};

/** Deterministic platform order so markup and tests agree. */
export const PLATFORM_ORDER: readonly AppPlatform[] = ['ios', 'android'];

/** Total number of app-store destination links across all apps. */
export function appStoreDestinationCount(
  apps: readonly EcosystemApp[] = HELPERG_APPS,
): number {
  return apps.reduce(
    (total, app) =>
      total + PLATFORM_ORDER.filter((p) => app.platforms[p] != null).length,
    0,
  );
}

/** The store links for one app, in deterministic order, omitting absent ones. */
export function appStoreLinks(
  app: EcosystemApp,
): { platform: AppPlatform; label: string; url: string }[] {
  return PLATFORM_ORDER.flatMap((platform) => {
    const url = app.platforms[platform];
    return url ? [{ platform, label: PLATFORM_LABELS[platform], url }] : [];
  });
}

/** True when the given project is the site currently being rendered. */
export function isCurrentProject(project: EcosystemWebProject): boolean {
  return project.id === CURRENT_PROJECT_ID;
}
