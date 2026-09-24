import type { ChallengeDTO } from '~/dtos/ChallengeDTO';

interface ChallengeListProps {
  challenges: ChallengeDTO[];
}

export function ChallengeList({ challenges }: ChallengeListProps) {
  return (
    <section aria-labelledby="challenges-title">
      <h2>Retos</h2>
      {challenges.length === 0 ? <p>No hay retos disponibles.</p> : (
        <ul>
          {challenges.map((challenge) => (
            <li key={challenge.id}>
              <h3>{challenge.title}</h3>
              <p>{challenge.prompt}</p>
              <p>Tiempo: {challenge.durationSeconds} segundos</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
