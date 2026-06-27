'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  videoKey: string | null;
  title?: string;
}

export function TrailerModal({ open, onClose, videoKey, title }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Reset loaded state every time the modal opens
  useEffect(() => {
    if (open) setLoaded(false);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        // ── Backdrop ──────────────────────────────────────────────
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
          aria-modal
          role="dialog"
          aria-label="Trailer"
        >
          {/* Blurred glass backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* ── Modal ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative z-10 w-full max-w-4xl"
            onClick={e => e.stopPropagation()} // don't close when clicking inside
          >
            {/* Header bar */}
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-white font-semibold text-sm md:text-base truncate max-w-[80%]">
                {title ? `${title} — Official Trailer` : 'Official Trailer'}
              </p>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center glass rounded-full text-white hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label="Close trailer"
              >
                ✕
              </motion.button>
            </div>

            {/* Video container — 16:9 aspect ratio */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black"
                 style={{ paddingTop: '56.25%' }}>

              {/* Loading spinner — shown until iframe fires onLoad */}
              {!loaded && videoKey && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-white/20 border-t-[#E50914] rounded-full"
                  />
                </div>
              )}

              {/* No trailer fallback */}
              {!videoKey ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] text-gray-400 gap-3">
                  <span className="text-5xl">🎬</span>
                  <p className="font-medium">No trailer available</p>
                  <p className="text-xs text-gray-600">Check back later or watch on YouTube</p>
                </div>
              ) : (
                /* iframe — only rendered while modal is open, so video stops on close */
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
                  title="Trailer"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setLoaded(true)}
                />
              )}
            </div>

            {/* Mobile hint */}
            <p className="text-center text-gray-600 text-xs mt-3">
              Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-gray-400">Esc</kbd> or tap outside to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
