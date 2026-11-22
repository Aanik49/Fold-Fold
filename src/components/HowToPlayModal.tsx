import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SymbolIconSvg } from './GameIcon';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/45"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How to Play Fold Fold"
    >
      <div
        className="riso-card rounded-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden animate-riso-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#F2EFE9] border-b-[2.5px] border-[#141414] flex items-center justify-between">
          <div>
            <p className="font-mono-riso text-[11px] font-extrabold text-[#E63946] tracking-wider">
              EXHIBITION FIELD GUIDE
            </p>
            <h2 className="font-poster text-xl text-[#141414] uppercase">How to Play</h2>
          </div>
          <button
            onClick={onClose}
            className="riso-btn w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" strokeWidth={2.6} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto riso-scroll space-y-4 text-sm text-[#141414]">
          <div className="p-4 rounded-xl border-2 border-[#141414] bg-[#F2EFE9] space-y-2">
            <h3 className="font-poster text-sm uppercase text-[#1D3557]">
              1. Swipe to Fold & Match
            </h3>
            <p className="text-xs leading-relaxed text-[#141414]/85">
              Swipe across any dotted row or column crease (or tap near a crease) to fold the paper sheet over itself. When matching geometric symbols land on top of each other, both vanish. Clear every symbol in Par moves or fewer for 3 stars.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <SymbolIconSvg type="circle" size={26} />
              <SymbolIconSvg type="cross" size={26} />
              <SymbolIconSvg type="triangle" size={26} />
              <SymbolIconSvg type="square" size={26} />
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-[#141414] bg-[#F2EFE9] space-y-1.5">
            <h3 className="font-poster text-sm uppercase text-[#E63946]">
              2. The Paper Stays Folded
            </h3>
            <p className="text-xs leading-relaxed text-[#141414]/85">
              Every fold permanently shrinks the sheet and stacks paper layers. If mismatched symbols land together, a small red corner dog-ear shows a hidden symbol underneath — match the top symbol later to uncover it!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border-2 border-[#141414] bg-[#FAF8F5] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#F4A261] border-2 border-[#141414] font-bold text-xs">
                  →
                </span>
                <h4 className="font-poster text-xs uppercase">One-Way Tape</h4>
              </div>
              <p className="text-xs leading-relaxed text-[#141414]/80">
                Yellow hazard chevron tape locks a crease so it can only fold in the arrow direction.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border-2 border-[#141414] bg-[#FAF8F5] space-y-1.5">
              <div className="flex items-center gap-2">
                <SymbolIconSvg type="duplex_rb" size={24} />
                <h4 className="font-poster text-xs uppercase">Duplex Ink</h4>
              </div>
              <p className="text-xs leading-relaxed text-[#141414]/80">
                Printed with Red on one face and Blue on the reverse. Folding it over flips its active color!
              </p>
            </div>

            <div className="p-3.5 rounded-xl border-2 border-[#141414] bg-[#FAF8F5] space-y-1.5">
              <div className="flex items-center gap-2">
                <SymbolIconSvg type="wild" size={24} />
                <h4 className="font-poster text-xs uppercase">Wild Prism</h4>
              </div>
              <p className="text-xs leading-relaxed text-[#141414]/80">
                Four-color Bauhaus diamond that matches and cancels out with any ink symbol it lands on.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border-2 border-[#141414] bg-[#FAF8F5] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F4A261] border-2 border-[#141414]">
                  <span className="w-2 h-2 rounded-full bg-[#141414]" />
                </span>
                <h4 className="font-poster text-xs uppercase">Brass Eyelet Pin</h4>
              </div>
              <p className="text-xs leading-relaxed text-[#141414]/80">
                Anchors a tile to the studio table. You cannot lift a pinned flap — fold other sheets onto it instead.
              </p>
            </div>
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-riso text-[#141414]/70">
            <span>Shortcuts: Z Undo · R Retry · H Hint · M Mute</span>
            <button
              onClick={onClose}
              className="riso-btn px-5 py-2 rounded-xl font-poster text-xs uppercase bg-[#1D3557] text-[#FAF8F5] cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
