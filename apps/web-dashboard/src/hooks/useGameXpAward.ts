import { useCallback, useRef } from 'react';
import { calculateGameXp } from '@heritage/shared';
import { useAuth } from '../context/AuthContext';

/** Awards XP when a mini-game is won; returns XP earned (0 if guest). */
export function useGameXpAward(gameId: string) {
  const { awardGameXp, user } = useAuth();
  const awardedRef = useRef(false);

  const awardOnWin = useCallback(
    (mistakes: number): number => {
      if (awardedRef.current) return 0;
      awardedRef.current = true;
      const xp = calculateGameXp(mistakes);
      if (user?.role === 'student') {
        awardGameXp(gameId, xp);
        return xp;
      }
      return 0;
    },
    [awardGameXp, gameId, user?.role]
  );

  const resetAward = useCallback(() => {
    awardedRef.current = false;
  }, []);

  return { awardOnWin, resetAward };
}
