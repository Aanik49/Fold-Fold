import { useCallback, useEffect, useMemo, useState } from 'react';
import { DailyHub } from './components/DailyHub';
import { GameStage } from './components/GameStage';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LevelSelect } from './components/LevelSelect';
import { SplashScreen } from './components/SplashScreen';
import { TitleLobby } from './components/TitleLobby';
import { foldAudio } from './game/audio';
import { getDailyPuzzle, shiftDateKey } from './game/daily';
import { CATEGORIES, getCategoryById } from './game/levelsData';
import {
  getLocalTodayDateKey,
  loadAudioSettings,
  loadDailyProgress,
  loadProgress,
  recordDailyCompletion,
  saveAudioSettings,
  saveProgress,
} from './game/storage';
import { DailyProgressState, LevelDef, ProgressMap, ScreenMode } from './game/types';

export default function App() {
  const [todayDateKey] = useState(() => getLocalTodayDateKey());
  const [screen, setScreen] = useState<ScreenMode>('SPLASH');
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id);
  const [activeLevel, setActiveLevel] = useState<LevelDef>(CATEGORIES[0].levels[0]);

  const [playingMode, setPlayingMode] = useState<'campaign' | 'daily'>('campaign');
  const [activeDailyDateKey, setActiveDailyDateKey] = useState(todayDateKey);

  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [dailyProgress, setDailyProgress] = useState<DailyProgressState>(() =>
    loadDailyProgress(getLocalTodayDateKey())
  );
  const [guideOpen, setGuideOpen] = useState(false);

  const [sfxEnabled, setSfxEnabled] = useState(() => loadAudioSettings().sfx);
  const [musicEnabled, setMusicEnabled] = useState(() => loadAudioSettings().music);

  // Sync audio engine settings on mount
  useEffect(() => {
    foldAudio.initSettings(sfxEnabled, musicEnabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update ambient music scale mood whenever category changes
  useEffect(() => {
    if (playingMode === 'daily') {
      const dayNum = parseInt(activeDailyDateKey.slice(-2), 10) || 1;
      foldAudio.setCategoryMood(dayNum % CATEGORIES.length);
      return;
    }
    const idx = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    if (idx !== -1) {
      foldAudio.setCategoryMood(idx);
    }
  }, [activeCategoryId, playingMode, activeDailyDateKey]);

  const handleToggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev;
      foldAudio.setSfxEnabled(next);
      saveAudioSettings({ sfx: next, music: musicEnabled });
      return next;
    });
  }, [musicEnabled]);

  const handleToggleMusic = useCallback(() => {
    setMusicEnabled((prev) => {
      const next = !prev;
      foldAudio.setMusicEnabled(next);
      saveAudioSettings({ sfx: sfxEnabled, music: next });
      return next;
    });
  }, [sfxEnabled]);

  // Global Mute shortcut (M)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        handleToggleSfx();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleToggleSfx]);

  const todayBundle = useMemo(() => getDailyPuzzle(todayDateKey), [todayDateKey]);
  const activeDailyBundle = useMemo(
    () => getDailyPuzzle(activeDailyDateKey),
    [activeDailyDateKey]
  );

  const handleOpenCategory = useCallback((categoryId: string) => {
    const idx = CATEGORIES.findIndex((c) => c.id === categoryId);
    if (idx !== -1) setSelectedCategoryIdx(idx);
    setActiveCategoryId(categoryId);
    setPlayingMode('campaign');
    setScreen('LEVEL_SELECT');
  }, []);

  const handleQuickPlayCategory = useCallback(
    (categoryId: string) => {
      const cat = getCategoryById(categoryId);
      const idx = CATEGORIES.findIndex((c) => c.id === cat.id);
      if (idx !== -1) setSelectedCategoryIdx(idx);
      setActiveCategoryId(cat.id);
      setPlayingMode('campaign');

      const nextUnsolved =
        cat.levels.find((lvl) => (progress[lvl.id]?.bestStars ?? 0) === 0) ??
        cat.levels[0];
      setActiveLevel(nextUnsolved);
      setScreen('PLAYING');
    },
    [progress]
  );

  const handleSelectLevel = useCallback((level: LevelDef) => {
    setActiveCategoryId(level.categoryId);
    setActiveLevel(level);
    setPlayingMode('campaign');
    setScreen('PLAYING');
  }, []);

  const handlePlayDailyDate = useCallback((dateKey: string) => {
    setActiveDailyDateKey(dateKey);
    setPlayingMode('daily');
    setScreen('PLAYING');
  }, []);

  const handleCampaignLevelCleared = useCallback(
    (levelId: string, movesUsed: number, stars: number) => {
      setProgress((prev) => {
        const existing = prev[levelId];
        const bestStars = Math.max(existing?.bestStars ?? 0, stars);
        const bestMoves =
          existing?.bestMoves != null
            ? Math.min(existing.bestMoves, movesUsed)
            : movesUsed;
        const next: ProgressMap = {
          ...prev,
          [levelId]: { bestStars, bestMoves },
        };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const handleDailyLevelCleared = useCallback(
    (_levelId: string, movesUsed: number, stars: number) => {
      setDailyProgress((prev) =>
        recordDailyCompletion(
          prev,
          activeDailyBundle.dateKey,
          movesUsed,
          stars,
          activeDailyBundle.level.par,
          todayDateKey
        )
      );
    },
    [activeDailyBundle.dateKey, activeDailyBundle.level.par, todayDateKey]
  );

  const activeCategory = getCategoryById(activeCategoryId);
  const currentCatIdx = CATEGORIES.findIndex((c) => c.id === activeCategory.id);
  const currentLvlIdx = activeCategory.levels.findIndex(
    (l) => l.id === activeLevel.id
  );
  const isLastInCategory = currentLvlIdx >= activeCategory.levels.length - 1;
  const hasNextCampaignLevel =
    !isLastInCategory || currentCatIdx < CATEGORIES.length - 1;

  const hasNextDailyDate = activeDailyDateKey < todayDateKey;

  const handleNextLevel = useCallback(() => {
    if (playingMode === 'daily') {
      if (activeDailyDateKey < todayDateKey) {
        setActiveDailyDateKey(shiftDateKey(activeDailyDateKey, 1));
      }
      return;
    }

    if (!isLastInCategory) {
      setActiveLevel(activeCategory.levels[currentLvlIdx + 1]);
    } else if (currentCatIdx < CATEGORIES.length - 1) {
      const nextCat = CATEGORIES[currentCatIdx + 1];
      setSelectedCategoryIdx(currentCatIdx + 1);
      setActiveCategoryId(nextCat.id);
      setActiveLevel(nextCat.levels[0]);
    }
  }, [
    playingMode,
    activeDailyDateKey,
    todayDateKey,
    activeCategory,
    currentCatIdx,
    currentLvlIdx,
    isLastInCategory,
  ]);

  return (
    <div className="w-full h-full overflow-hidden bg-[#F2EFE9] text-[#141414]">
      {screen === 'SPLASH' && (
        <SplashScreen onComplete={() => setScreen('TITLE')} />
      )}

      {screen === 'TITLE' && (
        <TitleLobby
          categories={CATEGORIES}
          selectedCategoryIdx={selectedCategoryIdx}
          onSelectCategoryIdx={(idx) => {
            setSelectedCategoryIdx(idx);
            setActiveCategoryId(CATEGORIES[idx].id);
          }}
          onOpenCategory={handleOpenCategory}
          onQuickPlayCategory={handleQuickPlayCategory}
          onOpenDaily={() => setScreen('DAILY')}
          todayDisplayDate={todayBundle.displayDate}
          todayDailyStars={dailyProgress.entries[todayDateKey]?.bestStars ?? 0}
          progress={progress}
          sfxEnabled={sfxEnabled}
          musicEnabled={musicEnabled}
          onToggleSfx={handleToggleSfx}
          onToggleMusic={handleToggleMusic}
          onOpenGuide={() => setGuideOpen(true)}
        />
      )}

      {screen === 'LEVEL_SELECT' && (
        <LevelSelect
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={(catId) => {
            const idx = CATEGORIES.findIndex((c) => c.id === catId);
            if (idx !== -1) setSelectedCategoryIdx(idx);
            setActiveCategoryId(catId);
          }}
          onSelectLevel={handleSelectLevel}
          onBackToLobby={() => setScreen('TITLE')}
          progress={progress}
          sfxEnabled={sfxEnabled}
          musicEnabled={musicEnabled}
          onToggleSfx={handleToggleSfx}
          onToggleMusic={handleToggleMusic}
          onOpenGuide={() => setGuideOpen(true)}
        />
      )}

      {screen === 'DAILY' && (
        <DailyHub
          todayDateKey={todayDateKey}
          dailyProgress={dailyProgress}
          onPlayDailyDate={handlePlayDailyDate}
          onBackToLobby={() => setScreen('TITLE')}
          sfxEnabled={sfxEnabled}
          musicEnabled={musicEnabled}
          onToggleSfx={handleToggleSfx}
          onToggleMusic={handleToggleMusic}
          onOpenGuide={() => setGuideOpen(true)}
        />
      )}

      {screen === 'PLAYING' && playingMode === 'campaign' && (
        <GameStage
          category={activeCategory}
          level={activeLevel}
          hasNextLevel={hasNextCampaignLevel}
          isLastInCategory={isLastInCategory}
          onBackToSheets={() => setScreen('LEVEL_SELECT')}
          onNextLevel={handleNextLevel}
          onLevelCleared={handleCampaignLevelCleared}
          sfxEnabled={sfxEnabled}
          musicEnabled={musicEnabled}
          onToggleSfx={handleToggleSfx}
          onToggleMusic={handleToggleMusic}
          onOpenGuide={() => setGuideOpen(true)}
        />
      )}

      {screen === 'PLAYING' && playingMode === 'daily' && (
        <GameStage
          category={activeDailyBundle.category}
          level={activeDailyBundle.level}
          dailyMeta={{
            dateKey: activeDailyBundle.dateKey,
            displayDate: activeDailyBundle.displayDate,
            dayOfYear: activeDailyBundle.dayOfYear,
            totalDaysInYear: activeDailyBundle.totalDaysInYear,
            currentStreak: dailyProgress.currentStreak,
          }}
          hasNextLevel={hasNextDailyDate}
          isLastInCategory={false}
          onBackToSheets={() => setScreen('DAILY')}
          onNextLevel={handleNextLevel}
          onLevelCleared={handleDailyLevelCleared}
          sfxEnabled={sfxEnabled}
          musicEnabled={musicEnabled}
          onToggleSfx={handleToggleSfx}
          onToggleMusic={handleToggleMusic}
          onOpenGuide={() => setGuideOpen(true)}
        />
      )}

      <HowToPlayModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
