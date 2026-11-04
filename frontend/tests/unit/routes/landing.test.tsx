import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import Landing from '~/routes/landing';

vi.mock('~/components/session-provider', () => ({ useSession: () => ({ user: null, loading: false }) }));
// Visual canvas/gradient rendering is exercised in the real-browser suite.
vi.mock('~/components/ShinyText', () => ({ default: ({ text, className }: { text: string; className?: string }) => <span className={className}>{text}</span> }));

describe('Prelaunch landing', () => {
  it('invites visitors to create an account and explains the app interactively', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Quiero mi próximo flash' })).toHaveAttribute('href', '/register');
    fireEvent.click(screen.getByRole('button', { name: 'Descubrir el flash' }));
    expect(screen.getByRole('heading', { name: 'Mira hacia arriba.' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '¿Y después?' }));
    expect(screen.getByRole('heading', { name: 'Dos cámaras. Una historia tuya.' })).toBeInTheDocument();
  });

  it('does not pretend the app is already available in the stores', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Próximamente en App Store' }));
    expect(screen.getByText(/Todavía no estamos en App Store/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crea tu cuenta y entérate antes' })).toHaveAttribute('href', '/register');
  });

  it('opens registration when the ticket is torn using the keyboard', async () => {
    render(<MemoryRouter><Routes><Route path="/" element={<Landing />} /><Route path="/register" element={<h1>Crear cuenta</h1>} /></Routes></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Crear cuenta directamente' })).toHaveAttribute('href', '/register');
    fireEvent.keyDown(screen.getByRole('button', { name: 'Romper el ticket y crear mi cuenta' }), { key: 'Enter' });
    expect(await screen.findByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();
  });
});
