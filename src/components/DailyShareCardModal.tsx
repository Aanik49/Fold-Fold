import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Share2, X } from 'lucide-react';
import { foldAudio } from '../game/audio';
import {
  copyDailyShareText,
  DailySharePayload,
  downloadDailyCardPng,
  renderDailyShareCardCanvas,
  shareDailyCard,
} from '../game/shareCard';

interface DailyShareCardModalProps {
  payload: DailySharePayload | null;
  onClose: () => void;
}

export const DailyShareCardModal: React.FC<DailyShareCardModalProps> = ({
  payload,
  onClose,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  // Render crisp preview PNG whenever payload changes
  useEffect(() => {
    if (!payload) {
      setPreviewUrl(null);
      return;
    }
    setFeedback(null);
    setCopied(false);

    let active = true;
    const renderPreview = () => {
      if (!active) return;
      const canvas = renderDailyShareCardCanvas(payload);
      setPreviewUrl(canvas.toDataURL('image/png'));
    };

    renderPreview();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(renderPreview).catch(() => {});
    }

    return () => {
      active = false;
    };
  }, [payload]);

  // Escape key closes modal
  useEffect(() => {
    if (!payload) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [payload, onClose]);

  if (!payload) return null;

  const flashFeedback = (msg: string) => {
    setFeedback(msg);
    window.setTimeout(() => {
      setFeedback((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const handleNativeShare = async () => {
    if (busy) return;
    setBusy(true);
    foldAudio.playCardstockFold();
    try {
      const result = await shareDailyCard(payload);
      if (result === 'shared') {
        flashFeedback('PROOF CARD SHARED!');
      } else if (result === 'downloaded') {
        setCopied(true);
        flashFeedback('PNG SAVED & TEXT COPIED!');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadPng = async () => {
    if (busy) return;
    setBusy(true);
    foldAudio.playClick(560);
    try {
      await downloadDailyCardPng(payload);
      flashFeedback('PNG PROOF SAVED!');
    } finally {
      setBusy(false);
    }
  };

  const handleCopyText = async () => {
    foldAudio.playClick(620);
    const ok = await copyDailyShareText(payload);
    if (ok) {
      setCopied(true);
      flashFeedback('SPOILER-FREE SUMMARY COPIED!');
      window.setTimeout(() => setCopied(false), 2200);
    } else {
      flashFeedback('COULD NOT ACCESS CLIPBOARD');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/55"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          foldAudio.playClick(460);
          onClose();
        }
      }}
    >
      <div className="riso-card rounded-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden animate-riso-pop">
        {/* Top Stamp Header */}
        <div className="px-4 py-3 sm:px-5 border-b-[2.5px] border-[var(--charcoal-ink)] bg-[var(--paper-white)] flex items-center justify-between gap-2 shrink-0">
          <div className="min-w-0">
            <div className="font-mono-riso text-[10px] font-extrabold uppercase tracking-wider text-[var(--signal-red)]">
              SPOILER-FREE DAILY PROOF
            </div>
            <h3 className="font-poster text-base sm:text-lg uppercase text-[var(--charcoal-ink)] truncate">
              SHARE RISOGRAPH CARD
            </h3>
          </div>
          <button
            onClick={() => {
              foldAudio.playClick(460);
              onClose();
            }}
            aria-label="Close Share Card"
            className="riso-btn w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4 text-[var(--charcoal-ink)]" strokeWidth={2.8} />
          </button>
        </div>

        {/* Rendered Risograph Card Preview */}
        <div className="flex-1 overflow-y-auto riso-scroll p-3.5 sm:p-4 bg-[var(--newsprint)] flex flex-col items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`Fold Fold Daily #${payload.dayOfYear} Risograph Result Card`}
              className="w-full max-w-[310px] sm:max-w-[330px] h-auto rounded-xl border-[2.5px] border-[var(--charcoal-ink)] shadow-[4px_4px_0px_var(--charcoal-ink)]"
            />
          ) : (
            <div className="w-full max-w-[310px] aspect-[900/1120] rounded-xl border-2 border-dashed border-[var(--charcoal-ink)]/40 flex items-center justify-center font-mono-riso text-xs font-bold text-[var(--charcoal-ink)]/60">
              PRINTING PROOF...
            </div>
          )}

          {feedback && (
            <div className="mt-3 px-3 py-1 rounded-full bg-[var(--charcoal-ink)] text-[var(--on-ink)] font-mono-riso text-[11px] font-extrabold uppercase tracking-wide">
              {feedback}
            </div>
          )}
        </div>

        {/* Instant Share / Save / Copy Actions */}
        <div className="p-3.5 sm:p-4 border-t-[2.5px] border-[var(--charcoal-ink)] bg-[var(--paper-white)] flex flex-col gap-2 shrink-0">
          <button
            onClick={handleNativeShare}
            disabled={busy}
            className="riso-btn w-full py-3 px-4 rounded-xl bg-[var(--cobalt-blue)] text-[var(--on-blue)] font-poster text-sm uppercase tracking-wide flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Share2 className="w-4 h-4" strokeWidth={2.6} />
            <span>SHARE PROOF CARD</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadPng}
              disabled={busy}
              className="riso-btn py-2.5 px-3 rounded-xl font-mono-riso text-xs font-extrabold uppercase flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4" strokeWidth={2.5} />
              <span>SAVE PNG</span>
            </button>

            <button
              onClick={handleCopyText}
              className="riso-btn py-2.5 px-3 rounded-xl font-mono-riso text-xs font-extrabold uppercase flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[var(--riso-teal)]" strokeWidth={2.8} />
                  <span className="text-[var(--riso-teal)]">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" strokeWidth={2.5} />
                  <span>COPY TEXT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
