import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { ChallengeList } from '~/components/challenge-list';
import type { ChallengeDTO } from '~/dtos/ChallengeDTO';
import { getChallenges } from '~/services/challenge-service';

describe('Challenges client-server integration', () => {
  it('loads challenges from the real API and displays them', async () => {
    let challenges: ChallengeDTO[] = [];

    await waitFor(
      async () => {
        challenges = await getChallenges();
        expect(challenges).toHaveLength(3);
      },
      { timeout: 10_000 },
    );

    render(<ChallengeList challenges={challenges} />);

    expect(
      screen.getByRole('heading', { name: 'Algo azul', level: 3 }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Tu lugar favorito', level: 3 }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Tu día en cinco palabras',
        level: 3,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Fotografía algo azul que tengas cerca.'),
    ).toBeInTheDocument();

    expect(screen.getByText('Tiempo: 120 segundos')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
