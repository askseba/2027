export type VoiceStatus = 'idle' | 'listening' | 'error' | 'transcript';

export interface VoiceState {
  status: VoiceStatus;
  transcript: string;
  error: string;
}
