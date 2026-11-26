import React, { useEffect, useState } from 'react';
import { foldAudio } from '../game/audio';
import { GameIcon } from './GameIcon';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [exiting, setExiting] = useState(false);

  const triggerExit = () => {
    if (exiting) return;
    setExiting(true);
    foldAudio.unlock();
    foldAudio.playSplashStamp();
    window.setTimeout(() => {
      onComplete();
    }, 260);
  };

  useEffect(() => {
    const autoTimer = window.setTimeout(() => {
      setExiting(true);
      window.setTimeout(onComplete, 260);
    }, 2150);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        triggerExit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(autoTimer);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={triggerExit}
      role="button"
      tabIndex={0}
      aria-label="Enter Fold Fold"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center riso-grain-bg cursor-pointer transition-opacity duration-250 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Swiss Print Registration Marks at all 4 corners */}
      <div className="pointer-events-none fixed inset-5 sm:inset-8 border border-[var(--charcoal-ink)]/20">
        <span className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--charcoal-ink)]" />
        <span className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--charcoal-ink)]" />
        <span className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--charcoal-ink)]" />
        <span className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--charcoal-ink)]" />
      </div>

      {/* Center Registration Stack */}
      <div className="relative flex flex-col items-center">
        {/* Animated Risograph Color Plates converging onto Game Icon */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-35 animate-plate-red">
            <div className="w-24 h-24 rounded-2xl bg-[var(--signal-red)] -translate-x-2 -translate-y-2" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-35 animate-plate-blue">
            <div className="w-24 h-24 rounded-2xl bg-[var(--cobalt-blue)] translate-x-2 translate-y-2" />
          </div>
          <div className="relative z-10 animate-riso-pop">
            <GameIcon size={108} />
          </div>
        </div>

        {/* Bold Bauhaus Stacked Poster Lockup */}
        <div className="text-center select-none leading-[0.86]">
          <div className="font-poster text-6xl sm:text-7xl tracking-tight text-[var(--charcoal-ink)] animate-plate-blue">
            FOLD
          </div>
          <div className="relative font-poster text-6xl sm:text-7xl tracking-tight animate-plate-red">
            <span
              aria-hidden="true"
              className="absolute inset-0 text-[var(--mustard-yellow)]/55 translate-x-[2.5px] translate-y-[2px]"
            >
              FOLD
            </span>
            <span className="relative text-[var(--signal-red)]">FOLD</span>
          </div>
        </div>

        <p className="mt-5 font-mono-riso text-xs font-bold tracking-[0.16em] text-[var(--charcoal-ink)]/75 uppercase">
          Bauhaus Origami Puzzle · 120 Sheets
        </p>

        {/* Crisp Risograph Press Progress Bar */}
        <div className="mt-7 w-52 h-2.5 bg-[var(--newsprint-dark)] border-2 border-[var(--charcoal-ink)] overflow-hidden">
          <div className="h-full bg-[var(--cobalt-blue)] animate-splash-bar" />
        </div>

        <p className="mt-3 font-mono-riso text-[11px] font-semibold text-[var(--charcoal-ink)]/55">
          Tap anywhere to begin
        </p>
      </div>
    </div>
  );
};
