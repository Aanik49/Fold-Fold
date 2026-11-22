import { useCallback, useEffect, useState } from 'react';
import { GameStage } from './components/GameStage';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LevelSelect } from './components/LevelSelect';
import { SplashScreen } from './components/SplashScreen';
import { TitleLobby } from './components/TitleLobby';
import { foldAudio } from './game/audio';
import { CATEGORIES, getCategoryById } from './game/levelsData';
import {
  loadAudioSettings,
  loadProgress,
  saveAudioSettings,
  saveProgress,
} from './game/storage';
import { LevelDef, ProgressMap, ScreenMode } from './game/types';

export default function App() {
  const [screen, setScreen] = useState<ScreenMode>('SPLASH');
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id);
  const [activeLevel, setActiveLevel] = useState<LevelDef>(CATEGORIES[0].levels[0]);
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
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
    const idx = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    if (idx !== -1) {
      foldAudio.setCategoryMood(idx);
    }
  }, [activeCategoryId]);

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

  const handleOpenCategory = useCallback((categoryId: string) => {
    const idx = CATEGORIES.findIndex((c) => c.id === categoryId);
    if (idx !== -1) setSelectedCategoryIdx(idx);
    setActiveCategoryId(categoryId);
    setScreen('LEVEL_SELECT');
  }, []);

  const handleQuickPlayCategory = useCallback(
    (categoryId: string) => {
      const cat = getCategoryById(categoryId);
      const idx = CATEGORIES.findIndex((c) => c.id === cat.id);
      if (idx !== -1) setSelectedCategoryIdx(idx);
      setActiveCategoryId(cat.id);

      // Jump to the first unsolved sheet in this category (or sheet 01 if all cleared)
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
    setScreen('PLAYING');
  }, []);

  const handleLevelCleared = useCallback(
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

  const activeCategory = getCategoryById(activeCategoryId);
  const currentCatIdx = CATEGORIES.findIndex((c) => c.id === activeCategory.id);
  const currentLvlIdx = activeCategory.levels.findIndex(
    (l) => l.id === activeLevel.id
  );
  const isLastInCategory = currentLvlIdx >= activeCategory.levels.length - 1;
  const hasNextLevel =
    !isLastInCategory || currentCatIdx < CATEGORIES.length - 1;

  const handleNextLevel = useCallback(() => {
    if (!isLastInCategory) {
      setActiveLevel(activeCategory.levels[currentLvlIdx + 1]);
    } else if (currentCatIdx < CATEGORIES.length - 1) {
      const nextCat = CATEGORIES[currentCatIdx + 1];
      setSelectedCategoryIdx(currentCatIdx + 1);
      setActiveCategoryId(nextCat.id);
      setActiveLevel(nextCat.levels[0]);
    }
  }, [activeCategory, currentCatIdx, currentLvlIdx, isLastInCategory]);

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

      {screen === 'PLAYING' && (
        <GameStage
          category={activeCategory}
          level={activeLevel}
          hasNextLevel={hasNextLevel}
          isLastInCategory={isLastInCategory}
          onBackToSheets={() => setScreen('LEVEL_SELECT')}
          onNextLevel={handleNextLevel}
          onLevelCleared={handleLevelCleared}
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
