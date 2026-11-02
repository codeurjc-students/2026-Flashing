import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { ApiError, login, registerUser } from '~/services/auth-service';

export function meta() {
  return [{ title: 'Registro | Flashing' }];
}

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    try {
      await registerUser({
        username: String(form.get('username')),
        displayName: String(form.get('displayName')),
        email,
        password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      await login(email, password);
      navigate('/profile');
    } catch (exception) {
      setError(exception instanceof ApiError ? exception.message : 'No se ha podido crear la cuenta.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Crear una cuenta</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombre de usuario <input name="username" minLength={3} maxLength={30} required /></label>
        <label>Nombre visible <input name="displayName" maxLength={60} required /></label>
        <label>Correo electrónico <input name="email" type="email" required /></label>
        <label>Contraseña <input name="password" type="password" minLength={8} maxLength={64} required /></label>
        <small>Debe incluir mayúscula, minúscula, número y carácter especial.</small>
        {error && <p role="alert">{error}</p>}
        <button disabled={submitting} type="submit">{submitting ? 'Creando…' : 'Crear cuenta'}</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>.</p>
    </main>
  );
}
