import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceSearch } from './useVoiceSearch';

describe('useVoiceSearch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial state: idle, empty transcript, empty error', () => {
    const { result } = renderHook(() => useVoiceSearch());
    expect(result.current.state).toEqual({
      status: 'idle',
      transcript: '',
      error: '',
    });
    expect(result.current.state.status).toBe('idle');
    expect(result.current.state.transcript).toBe('');
    expect(result.current.state.error).toBe('');
  });

  it('exposes startListening, stopListening, reset, isSupported', () => {
    const { result } = renderHook(() => useVoiceSearch());
    expect(typeof result.current.startListening).toBe('function');
    expect(typeof result.current.stopListening).toBe('function');
    expect(typeof result.current.reset).toBe('function');
    expect(typeof result.current.isSupported).toBe('boolean');
  });

  it('accepts optional onTranscript callback', () => {
    const onTranscript = vi.fn();
    const { result } = renderHook(() => useVoiceSearch({ onTranscript }));
    expect(result.current.state.status).toBe('idle');
    // onTranscript is only called when status becomes transcript (browser API); no-op in jsdom
    expect(onTranscript).not.toHaveBeenCalled();
  });

  it('state types match VoiceStatus: idle | listening | error | transcript', () => {
    const { result } = renderHook(() => useVoiceSearch());
    const validStatuses = ['idle', 'listening', 'error', 'transcript'];
    expect(validStatuses).toContain(result.current.state.status);
  });
});
