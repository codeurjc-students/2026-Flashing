import type { ChallengeDTO } from '../dtos/ChallengeDTO';

export async function getChallenges(): Promise<ChallengeDTO[]> {
  const response = await fetch('/api/v1/challenges');
  if (!response.ok) {
    throw new Error('No se han podido cargar los retos. Inténtalo de nuevo más tarde.');
  }
  return response.json();
}
