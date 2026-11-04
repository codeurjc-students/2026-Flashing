import { ApiError } from './auth-service';

export function authErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return 'No hemos podido conectar. Inténtalo de nuevo en un momento.';
  if (error.status === 401) return 'El correo o la contraseña no son correctos.';
  if (error.status === 403) return 'No hemos podido validar la solicitud. Recarga la página e inténtalo de nuevo.';
  if (error.status === 409) {
    return error.message.includes('Username')
      ? 'Ese nombre de usuario ya está reservado. Prueba con otro.'
      : 'Ya existe una cuenta con ese correo. Puedes iniciar sesión.';
  }
  if (error.status === 400) return 'Revisa los datos y los requisitos de la contraseña.';
  return 'Algo no ha salido como esperábamos. Inténtalo de nuevo en un momento.';
}
