import type { ChallengeDTO } from '../dtos/ChallengeDTO';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function getChallenges(): Promise<ChallengeDTO[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/challenges`);
  if (!response.ok) {
    throw new Error('No se han podido cargar los retos. Inténtalo de nuevo más tarde.');
  }
  return response.json();
}
