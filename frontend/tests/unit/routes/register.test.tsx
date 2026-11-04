import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Register from '~/routes/register';
import { login, registerUser } from '~/services/auth-service';
import type { UserDTO } from '~/dtos/UserDTO';

vi.mock('~/components/session-provider', () => ({ useSession: () => ({ user: null, loading: false, setUser: vi.fn() }) }));
vi.mock('~/services/auth-service', async (importOriginal) => ({
  ...await importOriginal<typeof import('~/services/auth-service')>(), registerUser: vi.fn(), login: vi.fn(),
}));

function prepareForm() {
  render(<MemoryRouter initialEntries={['/register']}><Routes><Route path="/register" element={<Register />} /><Route path="/welcome" element={<h1>Cuenta en espera</h1>} /></Routes></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Tu nombre'), { target: { value: 'Isi' } });
  fireEvent.change(screen.getByLabelText('Nombre de usuario'), { target: { value: 'earlybird' } });
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'bird@example.com' } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Password_1' } });
}

describe('Prelaunch registration', () => {
  beforeEach(() => vi.resetAllMocks());

  it('offers only an optional launch notification and sends the selected consent', async () => {
    vi.mocked(registerUser).mockResolvedValue({} as UserDTO);
    vi.mocked(login).mockResolvedValue({} as UserDTO);
    prepareForm();
    const launch = screen.getByRole('checkbox', { name: 'Avísame por correo cuando Flashing esté lista.' });
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(launch).not.toBeChecked();
    fireEvent.click(launch);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Crear mi cuenta' }), { key: 'End' });
    await screen.findByRole('heading', { name: 'Cuenta en espera' });
    expect(registerUser).toHaveBeenCalledWith(expect.objectContaining({
      email: 'bird@example.com', launchUpdates: true,
    }));
  });

  it('acknowledges successful registration if automatic login fails instead of creating the account again', async () => {
    vi.mocked(registerUser).mockResolvedValue({} as UserDTO);
    vi.mocked(login).mockRejectedValue(new Error('Connection interrupted'));
    prepareForm();
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Crear mi cuenta' }), { key: 'End' });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Tu cuenta ya está creada.'));
    expect(screen.queryByRole('slider', { name: 'Crear mi cuenta' })).not.toBeInTheDocument();
    expect(registerUser).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login');
  });

  it('does not submit an invalid registration through the slider', () => {
    prepareForm();
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'invalid-email' } });
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Crear mi cuenta' }), { key: 'End' });
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('shows a failed request as an error and allows another attempt', async () => {
    vi.mocked(registerUser).mockRejectedValueOnce(new Error('Connection interrupted'));
    prepareForm();
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Crear mi cuenta' }), { key: 'End' });
    await screen.findByRole('alert');
    await waitFor(() => expect(document.querySelector('.slide-commit')).toHaveAttribute('data-phase', 'error'));
    vi.mocked(registerUser).mockResolvedValue({} as UserDTO);
    vi.mocked(login).mockResolvedValue({} as UserDTO);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Crear mi cuenta' }), { key: 'Enter' });
    await screen.findByRole('heading', { name: 'Cuenta en espera' });
    expect(registerUser).toHaveBeenCalledTimes(2);
  });
});
