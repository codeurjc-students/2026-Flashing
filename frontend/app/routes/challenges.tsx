import { ChallengeList } from '~/components/challenge-list';
import { getChallenges } from '~/services/challenge-service';
import type { Route } from './+types/challenges';

export function meta() {
  return [
    { title: 'Flashing' },
    { name: 'description', content: 'Administración de retos de Flashing' },
  ];
}

export async function clientLoader() {
  return getChallenges();
}

export default function Challenges({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Flashing</h1>
      <ChallengeList challenges={loaderData} />
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <main>
      <h1>Flashing</h1>
      <p role="alert">No se han podido cargar los retos. Inténtalo de nuevo más tarde.</p>
    </main>
  );
}
