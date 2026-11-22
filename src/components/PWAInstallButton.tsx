import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { foldAudio } from '../game/audio';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={() => {
          foldAudio.playClick(620);
          install();
        }}
        title="Install Fold Fold App"
        className="riso-btn h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#1D3557] text-[#FAF8F5] flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4" strokeWidth={2.5} />
        <span className="hidden sm:inline">Install</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            foldAudio.playClick(620);
            setShowIOSGuide(true);
          }}
          title="Install on iOS"
          className="riso-btn h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#1D3557] text-[#FAF8F5] flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Install</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/45"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="riso-card rounded-2xl w-full max-w-sm p-6 animate-riso-pop"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-poster text-lg uppercase text-[#141414]">
                  Install Fold Fold
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="riso-btn w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
              <p className="text-xs leading-relaxed text-[#141414]/85">
                1. Tap the <strong>Share</strong> icon in Safari.
                <br />
                2. Tap <strong>Add to Home Screen</strong> to play full-screen offline.
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
