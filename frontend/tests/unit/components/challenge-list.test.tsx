import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ChallengeList } from '~/components/challenge-list';
import type { ChallengeDTO } from '~/dtos/ChallengeDTO';


describe("ChallengeList", () => {
    it("shows the received challenges", () => {
        const challenges: ChallengeDTO[] = [
            {
                id: 1,
                title: "Foto doble",
                prompt: "Haz dos fotos relacionadas",
                type: "DOUBLE_PHOTO",
                durationSeconds: 60
            },
            {
                id: 2,
                title: "Dibujo rápido",
                prompt: "Dibuja un objeto en poco tiempo",
                type: "QUICK_DRAWING",
                durationSeconds: 30
            }
        ];

        render(<ChallengeList challenges={challenges}/>);

        expect(
            screen.getByRole("heading", {
                name: "Retos",
                level: 2
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Foto doble",
                level: 3
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Dibujo rápido",
                level: 3
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Haz dos fotos relacionadas")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Dibuja un objeto en poco tiempo")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Tiempo: 60 segundos")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Tiempo: 30 segundos")
        ).toBeInTheDocument();

        expect(
            screen.getAllByRole("listitem")
        ).toHaveLength(2);
    });

    it("shows an empty message when no challenges are received", () => {

        render(<ChallengeList challenges={[]}/>);

        expect(
            screen.getByText("No hay retos disponibles.")
        ).toBeInTheDocument();

        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
});