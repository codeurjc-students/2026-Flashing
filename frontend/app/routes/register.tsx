import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '~/components/auth-layout';
import { NotificationFields } from '~/components/notification-fields';
import { useSession } from '~/components/session-provider';
import { ArrowIcon } from '~/components/site-chrome';
import { FormSlideCommit } from '~/components/form-slide-commit';
import { login, registerUser } from '~/services/auth-service';
import { authErrorMessage } from '~/services/auth-errors';

export function meta() {
  return [{ title: 'Hazte un hueco | Flashing' }];
}

export default function Register() {
  const navigate = useNavigate();
  const { user, loading, setUser } = useSession();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [preferences, setPreferences] = useState({ launchUpdates: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { if (user) navigate('/welcome', { replace: true }); }, [user, navigate]);

  async function handleSubmit(element: HTMLFormElement) {
    if (submitting || loading || created) return;
    setError('');
    setSubmitting(true);
    const form = new FormData(element);
    const email = String(form.get('email')).trim();
    const password = String(form.get('password'));
    try {
      await registerUser({
        username: String(form.get('username')).trim(),
        displayName: String(form.get('displayName')).trim(),
        email,
        password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        ...preferences,
      });
      setCreated(true);
      try {
        setUser(await login(email, password));
        navigate('/welcome', { replace: true });
      } catch {
        setError('Tu cuenta ya está creada. Inicia sesión para consultar tu aviso de lanzamiento.');
      }
    } catch (exception) {
      setError(authErrorMessage(exception));
      throw exception;
    } finally { setSubmitting(false); }
  }

  if (created) return <AuthLayout><h1>Ya tienes<br />tu sitio.</h1><p className="card-description" role="status">{error || 'Tu cuenta está creada. Estamos preparando tu próximo flash.'}</p><Link className="pill" to="/login">Iniciar sesión <ArrowIcon /></Link></AuthLayout>;

  return (
    <AuthLayout>
      <h1>Lo bueno<br />está por llegar.</h1>
      <p className="card-description">Crea tu cuenta de Flashing y elige si quieres recibir el aviso de lanzamiento. La app llegará a iOS y Android.</p>
      <form ref={formRef} className="account-form" aria-busy={submitting}>
        <fieldset className="form-fields" disabled={submitting}>
          <label>Tu nombre<input name="displayName" autoComplete="nickname" maxLength={60} required /></label>
          <div className="field-group"><label htmlFor="username">Nombre de usuario</label><input id="username" name="username" autoComplete="username" minLength={3} maxLength={30} pattern="[A-Za-z0-9_]+" aria-describedby="username-hint" required /><span className="field-hint" id="username-hint">Entre 3 y 30 letras, números o guiones bajos.</span></div>
          <label>Correo electrónico<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
          <div className="field-group"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={64} aria-describedby="password-hint" required /><span className="field-hint" id="password-hint">De 8 a 64 caracteres, con mayúscula, minúscula, número y un símbolo.</span></div>
        </fieldset>
        <NotificationFields preferences={preferences} onChange={setPreferences} disabled={submitting} />
        <p className="privacy-note">Puedes crear tu cuenta sin suscribirte a correos. Consulta <Link to="/privacy">cómo tratamos tus datos</Link>.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <FormSlideCommit formRef={formRef} label="Crear mi cuenta" disabled={submitting || loading} onConfirm={handleSubmit} />
      </form>
      <p className="form-alternative">¿Ya tienes tu sitio? <Link to="/login">Entra en tu cuenta.</Link></p>
    </AuthLayout>
  );
}
