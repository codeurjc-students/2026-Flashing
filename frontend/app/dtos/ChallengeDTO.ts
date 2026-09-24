export interface ChallengeDTO {
  id: number;
  title: string;
  prompt: string;
  type: 'DOUBLE_PHOTO' | 'QUICK_DRAWING' | 'SHORT_AUDIO' | 'GUIDED_PHOTO' | 'SHORT_TEXT';
  durationSeconds: number;
}
