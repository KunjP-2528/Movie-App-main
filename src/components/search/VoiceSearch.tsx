'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';

export function VoiceSearch({ onResult }: { onResult: (text: string) => void }) {
  const { enqueueSnackbar } = useSnackbar();
  const { status, progress, isModelLoading, isSupported, start } = useVoiceSearch(onResult);
  const loadingToastShown = useRef(false);

  // Tell the user the (one-time) model download is happening.
  useEffect(() => {
    if (isModelLoading && !loadingToastShown.current) {
      loadingToastShown.current = true;
      enqueueSnackbar('Preparing voice model — first use only, then it’s instant.', {
        variant: 'info',
      });
    }
  }, [isModelLoading, enqueueSnackbar]);

  if (!isSupported) return null;

  const recording = status === 'recording';
  const busy = status === 'transcribing';

  const label = recording
    ? 'Recording — click to stop'
    : isModelLoading
      ? `Loading voice model… ${progress}%`
      : busy
        ? 'Transcribing…'
        : 'Search by voice';

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={() => start((msg) => enqueueSnackbar(msg, { variant: 'warning' }))}
      disabled={busy}
      aria-label={label}
      title={label}
      className={`flex-shrink-0 flex items-center justify-center rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]/70 disabled:cursor-default ${
        recording ? 'text-[#E50914]' : 'text-gray-400 hover:text-white'
      }`}
    >
      {busy ? (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg
          className={`w-5 h-5 ${recording ? 'animate-pulse' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      )}
    </motion.button>
  );
}
