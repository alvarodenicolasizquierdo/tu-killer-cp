import { useUser } from '@/contexts/UserContext';

/**
 * FIX 1 [C-01]: Buyers are strictly read-only in TIC domain.
 * They cannot approve, reject, query, or take action on test results.
 */
export function useBuyerReadOnly() {
  const { currentUser } = useUser();
  const isBuyerReadOnly = currentUser.role === 'buyer';
  return { isBuyerReadOnly, currentUser };
}
