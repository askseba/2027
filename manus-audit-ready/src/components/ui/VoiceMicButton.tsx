'use client';

import { Mic, MicOff, XCircle } from 'lucide-react';
import type { VoiceState } from '@/types/voice-search';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VoiceMicButtonProps {
  className?: string;
  state: VoiceState;
  startListening: () => void;
  stopListening: () => void;
  reset: () => void;
}

export const VoiceMicButton = ({
  className,
  state,
  startListening,
  stopListening,
  reset,
}: VoiceMicButtonProps) => {
  const { status, transcript, error } = state;

  const handleClick = () => {
    if (status === 'listening') {
      stopListening();
    } else if (status === 'error') {
      reset();
    } else {
      startListening();
    }
  };

  const isListening = status === 'listening';
  const isError = status === 'error';

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        aria-label={isListening ? 'Stop listening' : isError ? 'Clear error' : 'Start voice search'}
        aria-pressed={isListening}
        className={cn(
          'rounded-full transition-colors',
          isListening && 'text-primary dark:text-accent-primary',
          isError && 'text-danger-red dark:text-red-400',
        )}
      >
        {isError ? (
          <XCircle className="h-5 w-5" aria-hidden />
        ) : isListening ? (
          <MicOff className="h-5 w-5" aria-hidden />
        ) : (
          <Mic className="h-5 w-5" aria-hidden />
        )}
      </Button>
      {transcript && (
        <span className="max-w-[200px] truncate text-xs text-text-secondary dark:text-text-muted" title={transcript}>
          {transcript}
        </span>
      )}
      {error && (
        <span className="max-w-[200px] truncate text-xs text-danger-red dark:text-red-400" title={error}>
          {error}
        </span>
      )}
    </div>
  );
};
