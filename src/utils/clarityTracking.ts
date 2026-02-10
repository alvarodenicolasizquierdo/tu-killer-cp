declare global {
  interface Window {
    clarity: (...args: any[]) => void;
  }
}

const APP_ID = 'portal';

function safeClarity(...args: any[]) {
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    window.clarity(...args);
  }
}

export function tagApp() {
  safeClarity('set', 'app', APP_ID);
}

export function tagEntryType() {
  const referrer = document.referrer;
  if (!referrer) {
    safeClarity('set', 'entry', 'direct');
  } else if (referrer.includes('carloshub-launchpad.dnaventures.es')) {
    safeClarity('set', 'entry', 'hub');
  } else {
    safeClarity('set', 'entry', new URL(referrer).hostname);
  }
}

export function tagUtmSource() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source');
  if (source) {
    safeClarity('set', 'source', source);
  }
}

export function tagScreen(screenName: string) {
  safeClarity('set', 'screen', screenName);
}

export function tagEvent(eventName: string, value?: string) {
  safeClarity('set', eventName, value || 'true');
}

export function tagIdentity(userId: string, role: string, displayName?: string) {
  safeClarity('identify', userId, undefined, undefined, displayName || userId);
  safeClarity('set', 'role', role);
}

export function initClarityTracking() {
  tagApp();
  tagEntryType();
  tagUtmSource();
}
