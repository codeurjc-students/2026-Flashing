import { Link } from 'react-router';
import { AuthLayout } from '~/components/auth-layout';

export function meta() {
  return [{ title: 'Tus datos, a tu ritmo | Flashing' }];
}

export default function Privacy() {
  return (
    <AuthLayout>
      <h1>Tus datos.<br />Tus decisiones.</h1>
      <div className="privacy-content">
        <p>Flashing es un proyecto en desarrollo.</p>
        <h2>Qué guardamos</h2>
        <p>Tu nombre, nombre de usuario, correo, zona horaria, fecha de creación y último acceso, y tu elección sobre el aviso de lanzamiento.</p>
        <h2>Qué eliges recibir</h2>
        <p>Puedes solicitar un único correo cuando se lance Flashing. Guardamos tu elección y la fecha en la que activas el aviso. Es voluntario: crear una cuenta no activa el aviso automáticamente.</p>
        <h2>Cómo cambiarlo</h2>
        <p>Puedes desactivar el aviso o eliminar tu cuenta desde <Link to="/welcome">tu cuenta</Link>.</p>
        <h2>Cookies de sesión</h2>
        <p>Utilizamos cookies para identificar tu sesión, renovarla y proteger los formularios. Esta web no incorpora herramientas de seguimiento publicitario ni analítica de terceros.</p>
      </div>
      <Link className="pill" to="/register">Crear mi cuenta</Link>
    </AuthLayout>
  );
}
