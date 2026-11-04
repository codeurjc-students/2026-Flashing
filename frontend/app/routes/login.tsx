import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '~/components/auth-layout';
import { useSession } from '~/components/session-provider';
import { FormSlideCommit } from '~/components/form-slide-commit';
import { login } from '~/services/auth-service';
import { authErrorMessage } from '~/services/auth-errors';

export function meta() {
  return [{ title: 'Tu próximo flash empieza aquí | Flashing' }];
}

export default function Login() {
  const navigate = useNavigate();
  const { user, loading, setUser } = useSession();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { if (user) navigate('/welcome', { replace: true }); }, [user, navigate]);

  async function handleSubmit(element: HTMLFormElement) {
    if (submitting || loading) return;
    setError('');
    setSubmitting(true);
    const form = new FormData(element);
    try {
      setUser(await login(String(form.get('email')).trim(), String(form.get('password'))));
      navigate('/welcome', { replace: true });
    } catch (exception) {
      setError(authErrorMessage(exception));
      throw exception;
    } finally { setSubmitting(false); }
  }

  return (
    <AuthLayout>
      <h1>Qué bien<br />que estés aquí.</h1>
      <p className="card-description">Entra para consultar tu cuenta y elegir cómo quieres enterarte del lanzamiento.</p>
      <form ref={formRef} className="account-form" aria-busy={submitting}>
        <fieldset className="form-fields" disabled={submitting}>
          <label>Correo electrónico<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
          <label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>
        </fieldset>
        {error && <p className="form-error" role="alert">{error}</p>}
        <FormSlideCommit formRef={formRef} label="Entrar" disabled={submitting || loading} onConfirm={handleSubmit} />
      </form>
      <p className="form-alternative">¿Todavía no tienes cuenta? <Link to="/register">Hazte un hueco.</Link></p>
    </AuthLayout>
  );
}
