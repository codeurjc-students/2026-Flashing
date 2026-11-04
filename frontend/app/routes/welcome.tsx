import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '~/components/auth-layout';
import { NotificationFields } from '~/components/notification-fields';
import { useSession } from '~/components/session-provider';
import { deleteCurrentUser, logout, updateNotificationPreferences } from '~/services/auth-service';
import { authErrorMessage } from '~/services/auth-errors';

export function meta() {
  return [{ title: 'Ya tienes tu sitio | Flashing' }, { name: 'robots', content: 'noindex, nofollow' }];
}

export default function Welcome() {
  const navigate = useNavigate();
  const { user, loading, setUser } = useSession();
  const [preferences, setPreferences] = useState({ launchUpdates: false });
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
    if (user) setPreferences({ launchUpdates: user.launchUpdates });
  }, [user, loading, navigate]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setMessage('');
    try {
      setUser(await updateNotificationPreferences(preferences));
      setMessage('Tu elección está guardada. A tu ritmo.');
    } catch (exception) {
      setError(authErrorMessage(exception));
    } finally { setPending(false); }
  }

  async function handleExit(remove = false) {
    setPending(true);
    setError('');
    try {
      if (remove) await deleteCurrentUser(); else await logout();
      setUser(null);
      navigate(remove ? '/' : '/login', { replace: true });
    } catch (exception) {
      setError(authErrorMessage(exception));
    } finally { setPending(false); }
  }

  if (!user) return <AuthLayout><p role="status">Preparando tu cuenta…</p></AuthLayout>;

  return (
    <AuthLayout>
      <img className="welcome-mark" src="/branding/flashing.svg" alt="" width="34" height="50" />
      <h1>Ya tienes<br />tu sitio.</h1>
      <p className="card-description">{user.displayName}, tu cuenta está creada y Flashing está casi lista. Estamos dando forma a tu próximo flash.</p>
      <p className="welcome-email">{user.launchUpdates ? <>Cuando llegue el lanzamiento, te avisaremos en <strong>{user.email}</strong>.</> : <>Activa el aviso si quieres enterarte del lanzamiento en <strong>{user.email}</strong>.</>}</p>
      <form className="account-form preferences-form" onSubmit={handleSave} aria-busy={pending}>
        <NotificationFields preferences={preferences} onChange={setPreferences} disabled={pending} />
        <button className="pill form-submit" type="submit" disabled={pending}>{pending ? 'Un momento…' : 'Guardar cambios'}</button>
      </form>
      {message && <p className="form-success" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="account-actions"><Link to="/">Volver a la landing</Link><button className="text-button" type="button" disabled={pending} onClick={() => handleExit()}>Cerrar sesión</button></div>
      {confirmDelete
        ? <div className="delete-confirmation"><p>¿Eliminar tu cuenta y cancelar el aviso de lanzamiento? Esta acción no se puede deshacer.</p><div className="account-actions"><button className="text-button danger" type="button" disabled={pending} onClick={() => handleExit(true)}>Sí, eliminar mi cuenta</button><button className="text-button" type="button" disabled={pending} onClick={() => setConfirmDelete(false)}>Cancelar</button></div></div>
        : <button className="text-button delete-account" type="button" disabled={pending} onClick={() => setConfirmDelete(true)}>Eliminar mi cuenta</button>}
    </AuthLayout>
  );
}
