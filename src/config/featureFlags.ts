/**
 * Feature Flags Configuration
 * 
 * Flags can be enabled via:
 * 1. Environment variable: VITE_NEW_IA_NAV_AND_HOME=true
 * 2. localStorage override: ff_NEW_IA_NAV_AND_HOME=1
 * 
 * localStorage takes precedence over env var for development flexibility.
 */

type FeatureFlagKey = 'NEW_IA_NAV_AND_HOME';

interface FeatureFlags {
  NEW_IA_NAV_AND_HOME: boolean;
}

const defaultFlags: FeatureFlags = {
  NEW_IA_NAV_AND_HOME: true,
};

/**
 * Check if a feature flag is enabled
 * Priority: localStorage > env var > default (false)
 */
export function isFeatureEnabled(flagKey: FeatureFlagKey): boolean {
  // Check localStorage first (allows runtime override)
  if (typeof window !== 'undefined') {
    const localStorageKey = `ff_${flagKey}`;
    const localValue = localStorage.getItem(localStorageKey);
    if (localValue === '1' || localValue === 'true') return true;
    if (localValue === '0' || localValue === 'false') return false;
  }

  // Check environment variable
  const envKey = `VITE_${flagKey}`;
  const envValue = import.meta.env[envKey];
  if (envValue === 'true' || envValue === '1') return true;
  if (envValue === 'false' || envValue === '0') return false;

  // Return default
  return defaultFlags[flagKey] ?? false;
}

/**
 * Get all feature flags with their current state
 */
export function getFlags(): FeatureFlags {
  return {
    NEW_IA_NAV_AND_HOME: isFeatureEnabled('NEW_IA_NAV_AND_HOME'),
  };
}

/**
 * Convenience export for direct access
 */
export const flags = {
  get NEW_IA_NAV_AND_HOME() {
    return isFeatureEnabled('NEW_IA_NAV_AND_HOME');
  },
};

/**
 * Hook for React components to access feature flags
 */
export function useFeatureFlag(flagKey: FeatureFlagKey): boolean {
  // Note: This is a simple implementation. For real-time updates,
  // you'd want to add a state + effect that listens for storage changes.
  return isFeatureEnabled(flagKey);
}
