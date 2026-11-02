import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { ApiError, login } from '~/services/auth-service';

export function meta() {
  return [{ title: 'Iniciar sesión | Flashing' }];
}

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get('email')), String(form.get('password')));
      navigate('/profile');
    } catch (exception) {
      setError(exception instanceof ApiError && exception.status === 401
        ? 'El correo o la contraseña no son correctos.'
        : 'No se ha podido iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label>Correo electrónico <input name="email" type="email" required /></label>
        <label>Contraseña <input name="password" type="password" required /></label>
        {error && <p role="alert">{error}</p>}
        <button disabled={submitting} type="submit">{submitting ? 'Entrando…' : 'Entrar'}</button>
      </form>
      <p>¿Aún no tienes cuenta? <Link to="/register">Regístrate</Link>.</p>
    </main>
  );
}
