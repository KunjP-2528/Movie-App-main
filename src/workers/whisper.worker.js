import { pipeline, env } from '@xenova/transformers';

// Always fetch models from the Hugging Face CDN (no local model files).
env.allowLocalModels = false;

/**
 * Lazily load the Whisper ASR pipeline once and reuse it.
 * whisper-tiny.en is ~40MB (quantized) and English-only — ideal for short
 * search queries. The model is cached by the browser after first download.
 */
class Transcriber {
  static task = 'automatic-speech-recognition';
  static model = 'Xenova/whisper-tiny.en';
  static instance = null;

  static get(progress_callback) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  const { type, audio } = event.data || {};
  const reportProgress = (p) => self.postMessage({ status: 'loading', progress: p });

  try {
    // Warm-up: start downloading / initialising the model ahead of time.
    if (type === 'load') {
      await Transcriber.get(reportProgress);
      self.postMessage({ status: 'ready' });
      return;
    }

    if (type === 'transcribe') {
      const transcriber = await Transcriber.get(reportProgress);
      const output = await transcriber(audio);
      self.postMessage({ status: 'complete', text: (output?.text ?? '').trim() });
    }
  } catch (err) {
    self.postMessage({ status: 'error', message: err?.message ?? 'Transcription failed.' });
  }
});
