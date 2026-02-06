'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { VoiceState } from '@/types/voice-search';

export type { VoiceState } from '@/types/voice-search';

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: { results: SpeechRecognitionResultList }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

const getSpeechRecognition = (): SpeechRecognitionCtor | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

const SpeechRecognition = getSpeechRecognition();

/** Perfumes list cache for fuzzy matching (api/perfumes or local) */
let perfumesCache: { name: string; brand: string }[] | null = null;

async function getPerfumesForFuzzy(): Promise<{ name: string; brand: string }[]> {
  if (perfumesCache?.length) return perfumesCache;
  try {
    const res = await fetch('/api/perfumes');
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.perfumes ?? [];
      const mapped = list.map((p: { name?: string; brand?: string }) => ({ name: p.name ?? '', brand: p.brand ?? '' }));
      perfumesCache = mapped;
      return mapped;
    }
  } catch {
    // fallback to local
  }
  const { perfumes } = await import('@/lib/data/perfumes');
  const mapped = perfumes.map((p) => ({ name: p.name, brand: p.brand }));
  perfumesCache = mapped;
  return mapped;
}

/** Optional fuzzy match: transcript → best perfume name/brand or transcript */
async function fuzzyTranscript(transcript: string): Promise<string> {
  try {
    const Fuse = (await import('fuse.js')).default;
    const perfumes = await getPerfumesForFuzzy();
    if (!perfumes.length) return transcript;
    const fuse = new Fuse(perfumes, {
      keys: ['name', 'brand'],
      threshold: 0.4,
    });
    const result = fuse.search(transcript);
    const best = result[0];
    if (best?.item?.name) return best.item.name;
    return transcript;
  } catch {
    return transcript;
  }
}

export interface UseVoiceSearchOptions {
  lang?: string;
  onTranscript?: (text: string) => void;
}

export const useVoiceSearch = (options?: UseVoiceSearchOptions) => {
  const onTranscriptRef = useRef(options?.onTranscript);
  const langRef = useRef(options?.lang || 'ar-SA');

  useEffect(() => {
    onTranscriptRef.current = options?.onTranscript;
  });

  useEffect(() => {
    langRef.current = options?.lang || 'ar-SA';
  });

  const [state, setState] = useState<VoiceState>({
    status: 'idle',
    transcript: '',
    error: '',
  });

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const getRecognition = useCallback(() => {
    if (!SpeechRecognition) {
      setState((s) => ({
        ...s,
        status: 'error',
        error: 'Speech recognition is not supported in this browser.',
      }));
      return null;
    }
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = langRef.current;

      recognitionRef.current.onresult = (event: { results: SpeechRecognitionResultList }) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join(' ')
          .trim();
        if (transcript) {
          setState((s) => ({
            ...s,
            status: 'transcript',
            transcript,
            error: '',
          }));
        }
      };

      recognitionRef.current.onerror = (event: { error: string }) => {
        const message = event.error === 'not-allowed' ? 'Microphone access denied.' : event.error || 'Speech recognition error.';
        setState((s) => ({
          ...s,
          status: 'error',
          error: message,
        }));
      };

      recognitionRef.current.onend = () => {
        setState((s) => (s.status === 'listening' ? { ...s, status: 'idle' } : s));
      };
    }
    return recognitionRef.current;
  }, []);

  const startListening = useCallback(() => {
    setState({ status: 'idle', transcript: '', error: '' });
    const rec = getRecognition();
    if (rec) {
      try {
        rec.start();
        setState((s) => ({ ...s, status: 'listening' }));
      } catch (e) {
        setState((s) => ({
          ...s,
          status: 'error',
          error: e instanceof Error ? e.message : 'Failed to start listening.',
        }));
      }
    }
  }, [getRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setState((s) => (s.status === 'listening' ? { ...s, status: 'idle' } : s));
    }
  }, []);

  const reset = useCallback(() => {
    stopListening();
    setState({ status: 'idle', transcript: '', error: '' });
  }, [stopListening]);

  // On final transcript: optional fuzzy match → onTranscript(fuzzyResult)
  useEffect(() => {
    if (state.status !== 'transcript' || !state.transcript) return;
    const cb = onTranscriptRef.current;
    if (!cb) return;
    let cancelled = false;
    fuzzyTranscript(state.transcript).then((text) => {
      if (!cancelled) cb(text);
    });
    return () => {
      cancelled = true;
    };
  }, [state.status, state.transcript]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    state,
    startListening,
    stopListening,
    reset,
    isSupported: !!SpeechRecognition,
  };
};
