import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceStatus = 'idle' | 'recording' | 'transcribing';

const MAX_RECORDING_MS = 8_000; // shorter clips = faster transcription

/**
 * On-device voice search using Whisper (transformers.js) in a Web Worker.
 * Records mic audio → decodes to 16kHz mono → transcribes locally.
 * Works in every browser and never sends audio to a remote service.
 *
 * The model is warmed up the moment recording starts, so the (one-time) ~40MB
 * download overlaps with the user speaking instead of blocking afterwards.
 */
export function useVoiceSearch(onResult: (text: string) => void) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const workerRef = useRef<Worker | null>(null);
  const modelReadyRef = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<number | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef<((msg: string) => void) | undefined>(undefined);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    setIsSupported(
      typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== 'undefined'
    );
  }, []);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/whisper.worker.js', import.meta.url),
        { type: 'module' }
      );
      workerRef.current.addEventListener('message', (e: MessageEvent) => {
        const data = e.data as {
          status: string;
          text?: string;
          message?: string;
          progress?: { progress?: number };
        };
        switch (data.status) {
          case 'loading':
            // Model is downloading/initialising — don't disturb the recording UI.
            setIsModelLoading(true);
            if (typeof data.progress?.progress === 'number') {
              setProgress(Math.round(data.progress.progress));
            }
            break;
          case 'ready':
            modelReadyRef.current = true;
            setIsModelLoading(false);
            setProgress(0);
            break;
          case 'complete': {
            modelReadyRef.current = true;
            setIsModelLoading(false);
            setStatus('idle');
            setProgress(0);
            const text = (data.text ?? '').trim();
            if (text) onResultRef.current(text);
            else onErrorRef.current?.("Didn't catch that — please try again.");
            break;
          }
          case 'error':
            setIsModelLoading(false);
            setStatus('idle');
            setProgress(0);
            onErrorRef.current?.(data.message ?? 'Voice search failed. Please try again.');
            break;
        }
      });
    }
    return workerRef.current;
  }, []);

  useEffect(
    () => () => {
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
      workerRef.current?.terminate();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    []
  );

  const transcribeBlob = useCallback(
    async (blob: Blob) => {
      try {
        setStatus('transcribing');
        const arrayBuffer = await blob.arrayBuffer();
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioCtx({ sampleRate: 16000 });
        const decoded = await audioContext.decodeAudioData(arrayBuffer);
        const audio = decoded.getChannelData(0); // mono Float32 @ 16kHz
        await audioContext.close();
        getWorker().postMessage({ type: 'transcribe', audio }, [audio.buffer]);
      } catch {
        setStatus('idle');
        onErrorRef.current?.('Could not process audio. Please try again.');
      }
    },
    [getWorker]
  );

  const start = useCallback(
    async (onError?: (msg: string) => void) => {
      onErrorRef.current = onError;

      if (!isSupported) {
        onError?.('Voice search is not supported in this browser.');
        return;
      }

      if (recorderRef.current && status === 'recording') {
        recorderRef.current.stop();
        return;
      }

      if (status === 'transcribing') return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
          streamRef.current?.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          recorderRef.current = null;
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          if (blob.size > 0) transcribeBlob(blob);
          else setStatus('idle');
        };

        recorder.start();
        setStatus('recording');

        // Warm up the model NOW so the download overlaps with the user speaking.
        if (!modelReadyRef.current) getWorker().postMessage({ type: 'load' });

        stopTimerRef.current = window.setTimeout(() => {
          if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        }, MAX_RECORDING_MS);
      } catch (err) {
        setStatus('idle');
        const name = (err as { name?: string })?.name;
        if (name === 'NotAllowedError')
          onError?.('Microphone access was blocked. Allow mic permission and try again.');
        else if (name === 'NotFoundError')
          onError?.('No microphone found. Connect a mic and try again.');
        else onError?.('Could not access microphone. Please try again.');
      }
    },
    [isSupported, status, getWorker, transcribeBlob]
  );

  return { status, progress, isModelLoading, isSupported, start };
}
