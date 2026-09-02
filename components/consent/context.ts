'use client';

import { createContext, useContext } from 'react';
import type { ConsentState } from '@/lib/consent/types';

/** The one canonical consent API every consent component consumes. */
export interface ConsentContextValue {
  state: ConsentState;
  /** True once the stored decision has been read on the client. */
  hydrated: boolean;
  /** Show the first-layer banner (hydrated and still undecided). */
  showBanner: boolean;
  /** Is the preferences dialog open? */
  preferencesOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  /** Apply an explicit analytics choice from the preferences panel. */
  savePreferences: (analytics: boolean) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

export const ConsentContext = createContext<ConsentContextValue | null>(null);

/** Access the consent API. Throws if used outside <ConsentProvider>. */
export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within <ConsentProvider>');
  return ctx;
}
