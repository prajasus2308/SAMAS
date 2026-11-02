import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  INITIAL_SAMAS_EXAMPLES,
  SamasExample,
  SamasCategoryId,
  getResultLevel,
} from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';

export type PoolFilterMode = 'all' | 'core5' | SamasCategoryId;

export interface UseSlotMachineOptions {
  onSpinComplete?: (example: SamasExample) => void;
}

export function useSlotMachine(options?: UseSlotMachineOptions) {
  const onSpinCompleteRef = useRef(options?.onSpinComplete);
  useEffect(() => {
    onSpinCompleteRef.current = options?.onSpinComplete;
  }, [options?.onSpinComplete]);

  const [examples, setExamples] = useState<SamasExample[]>(() => {
    try {
      const savedCustom = localStorage.getItem('sanskrit_samas_custom_examples_v1');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom) as SamasExample[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...INITIAL_SAMAS_EXAMPLES, ...parsed];
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_SAMAS_EXAMPLES;
  });

  const [poolFilter, setPoolFilterState] = useState<PoolFilterMode>('all');
  const [currentExample, setCurrentExample] = useState<SamasExample>(INITIAL_SAMAS_EXAMPLES[0]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reelSpinning, setReelSpinning] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  const [leverPulled, setLeverPulled] = useState<boolean>(false);
  const [cabinetShake, setCabinetShake] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([INITIAL_SAMAS_EXAMPLES[0].id]);
  const [spinHistory, setSpinHistory] = useState<SamasExample[]>([INITIAL_SAMAS_EXAMPLES[0]]);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.getMuted());

  const timersRef = useRef<number[]>([]);
  const tickIntervalRef = useRef<number | null>(null);
  const activeReelsCountRef = useRef<number>(3);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (tickIntervalRef.current !== null) {
      window.clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const getFilteredPool = useCallback(
    (overrideFilter?: PoolFilterMode) => {
      const activeFilter = overrideFilter ?? poolFilter;
      if (activeFilter === 'core5') {
        return examples.filter((ex) => ex.isCoreExhibition);
      }
      if (activeFilter === 'all') {
        return examples;
      }
      const byCategory = examples.filter((ex) => ex.categoryId === activeFilter);
      return byCategory.length > 0 ? byCategory : examples;
    },
    [examples, poolFilter]
  );

  // Active pool of examples for the currently selected category / mode
  const activePool = useMemo(() => getFilteredPool(), [getFilteredPool]);

  // Select a category filter and immediately align the machine preview if not spinning
  const setPoolFilter = useCallback(
    (mode: PoolFilterMode) => {
      setPoolFilterState(mode);
      soundEngine.playCategorySelect();
      if (!isSpinning) {
        const nextPool = getFilteredPool(mode);
        if (nextPool.length > 0 && !nextPool.some((ex) => ex.id === currentExample.id)) {
          setCurrentExample(nextPool[0]);
          setShowCelebration(false);
        }
      }
    },
    [isSpinning, getFilteredPool, currentExample.id]
  );

  const triggerShake = useCallback(() => {
    setCabinetShake(true);
    const t = window.setTimeout(() => setCabinetShake(false), 220);
    timersRef.current.push(t);
  }, []);

  const spin = useCallback(
    (options?: { specificExampleId?: string; categoryOverride?: SamasCategoryId }) => {
      if (isSpinning) return;

      clearAllTimers();
      if (options?.categoryOverride) {
        setPoolFilterState(options.categoryOverride);
      }

      setIsSpinning(true);
      setShowCelebration(false);
      setLeverPulled(true);
      setReelSpinning([true, true, true]);
      activeReelsCountRef.current = 3;

      // 1A. Distinct Lever Pull Sound + 1B. Electric Reel Spin Start
      soundEngine.playLeverPull();
      soundEngine.playReelSpinStart();

      // Return lever to upright position after pull animation
      const leverTimer = window.setTimeout(() => {
        setLeverPulled(false);
      }, 480);
      timersRef.current.push(leverTimer);

      // Select ONE complete verified Sanskrit example from the active category pool
      let nextExample: SamasExample;
      if (options?.specificExampleId) {
        nextExample =
          examples.find((e) => e.id === options.specificExampleId) || examples[0];
      } else {
        const pool = getFilteredPool(options?.categoryOverride);
        const candidates =
          pool.length > 1
            ? pool.filter((item) => item.id !== currentExample.id)
            : pool;
        const randomIndex = Math.floor(Math.random() * candidates.length);
        nextExample = candidates[randomIndex] || pool[0];
      }

      setCurrentExample(nextExample);

      // 2. Distinct Reel Spinning Sound Loop (responds to active reels remaining)
      let tickStep = 0;
      tickIntervalRef.current = window.setInterval(() => {
        tickStep += 1;
        soundEngine.playReelTick(activeReelsCountRef.current, tickStep);
      }, 92);

      // 3A. Reel 1 (पूर्वपद) stops at 1.25s: Solenoid thud + C4 chime + spring rebound click
      const t1 = window.setTimeout(() => {
        activeReelsCountRef.current = 2;
        setReelSpinning([false, true, true]);
        soundEngine.playIndividualReelStop(0);
        triggerShake();
      }, 1250);

      // 3B. Reel 2 (उत्तरपद) stops at 1.90s: Solenoid thud + E4 chime + spring rebound click
      const t2 = window.setTimeout(() => {
        activeReelsCountRef.current = 1;
        setReelSpinning([false, false, true]);
        soundEngine.playIndividualReelStop(1);
        triggerShake();
      }, 1900);

      // 3C. Reel 3 (समस्त पद) stops at 2.55s -> Final Result Reveal + Celebratory Jingle
      const t3 = window.setTimeout(() => {
        activeReelsCountRef.current = 0;
        if (tickIntervalRef.current !== null) {
          window.clearInterval(tickIntervalRef.current);
          tickIntervalRef.current = null;
        }
        setReelSpinning([false, false, false]);
        setIsSpinning(false);
        soundEngine.playIndividualReelStop(2);
        triggerShake();

        // 4. Final Result Reveal shimmer glissando at 90ms
        const revealTimer = window.setTimeout(() => {
          soundEngine.playResultReveal();
        }, 90);

        // 5. Celebratory Jingle for winning reveal, synchronized with Framer Motion result reveal & confetti
        const jingleTimer = window.setTimeout(() => {
          const resultLevel = getResultLevel(nextExample);
          soundEngine.playCelebratoryJingle(resultLevel);
        }, 220);

        timersRef.current.push(revealTimer, jingleTimer);

        setShowCelebration(true);
        setSpinCount((c) => c + 1);
        setDiscoveredIds((prev) =>
          prev.includes(nextExample.id) ? prev : [...prev, nextExample.id]
        );
        setSpinHistory((prev) => [nextExample, ...prev.slice(0, 9)]);
        onSpinCompleteRef.current?.(nextExample);
      }, 2550);

      timersRef.current.push(t1, t2, t3);
    },
    [isSpinning, clearAllTimers, examples, getFilteredPool, currentExample.id, triggerShake]
  );

  const resetSession = useCallback(() => {
    if (isSpinning) return;
    soundEngine.playButtonClick();
    setSpinCount(0);
    const initialTarget = activePool[0] || INITIAL_SAMAS_EXAMPLES[0];
    setDiscoveredIds([initialTarget.id]);
    setSpinHistory([initialTarget]);
    setCurrentExample(initialTarget);
    setShowCelebration(false);
  }, [isSpinning, activePool]);

  const addCustomExample = useCallback((newEx: Omit<SamasExample, 'id' | 'isCoreExhibition'>) => {
    const created: SamasExample = {
      ...newEx,
      id: `custom-${Date.now()}`,
      isCoreExhibition: false,
    };
    setExamples((prev) => {
      const updated = [...prev, created];
      const customOnly = updated.filter((item) => item.id.startsWith('custom-'));
      try {
        localStorage.setItem('sanskrit_samas_custom_examples_v1', JSON.stringify(customOnly));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
    return created;
  }, []);

  return {
    examples,
    activePool,
    poolFilter,
    setPoolFilter,
    currentExample,
    isSpinning,
    reelSpinning,
    leverPulled,
    cabinetShake,
    showCelebration,
    spinCount,
    discoveredIds,
    spinHistory,
    isMuted,
    toggleMute,
    spin,
    resetSession,
    addCustomExample,
  };
}
