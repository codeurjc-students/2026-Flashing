import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import type { UserDTO } from '~/dtos/UserDTO';
import {
  ApiError,
  deleteCurrentUser,
  getCurrentUser,
  logout,
  updateCurrentUser,
} from '~/services/auth-service';

export function meta() {
  return [{ title: 'Mi perfil | Flashing' }];
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((exception) => {
        if (exception instanceof ApiError && exception.status === 401) navigate('/login');
        else setError('No se ha podido cargar el perfil.');
      });
  }, [navigate]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      setUser(await updateCurrentUser({
        username: String(form.get('username')),
        displayName: String(form.get('displayName')),
        timezone: String(form.get('timezone')),
      }));
      setError('');
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se ha podido actualizar el perfil.');
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  async function handleDelete() {
    if (!window.confirm('¿Quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    await deleteCurrentUser();
    navigate('/register');
  }

  if (error && !user) return <main><p role="alert">{error}</p></main>;
  if (!user) return <main><p role="status">Cargando perfil…</p></main>;

  return (
    <main>
      <h1>Mi perfil</h1>
      <p>Correo: {user.email}</p>
      <p>Rol: {user.role}</p>
      <form onSubmit={handleUpdate}>
        <label>Nombre de usuario <input name="username" defaultValue={user.username} required /></label>
        <label>Nombre visible <input name="displayName" defaultValue={user.displayName} required /></label>
        <label>Zona horaria <input name="timezone" defaultValue={user.timezone} required /></label>
        {error && <p role="alert">{error}</p>}
        <button type="submit">Guardar cambios</button>
      </form>
      <button type="button" onClick={handleLogout}>Cerrar sesión</button>
      <button type="button" onClick={handleDelete}>Eliminar cuenta</button>
    </main>
  );
}
