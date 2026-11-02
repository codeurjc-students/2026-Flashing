# Autenticación web

El cliente web utiliza exclusivamente cookies. El navegador recibe los JWT mediante `Set-Cookie`; no se devuelven en JSON, no se guardan en `localStorage` y no se envían cabeceras Bearer. No hay soporte móvil de autenticación implementado todavía.

## Cookies y HTTPS

- `AuthToken`: JWT de acceso, con duración de 15 minutos y ruta `/api`.
- `RefreshToken`: JWT de renovación, con duración de 7 días y ruta `/api/v1/auth`.
- Las cookies JWT y CSRF son `Secure` por defecto, `HttpOnly` y `SameSite=Strict`. Las cookies JWT no incluyen atributo `Domain`. Únicamente los servidores de pruebas que cargan `TestcontainersConfiguration` desactivan `Secure` mediante `src/test/resources/test-cookies.properties`, para ejecutar las pruebas existentes sobre HTTP. Este archivo no se incluye en la aplicación de producción.
- `Secure` exige HTTPS para transportar la cookie; no cifra por sí mismo su contenido almacenado. TLS cifra la comunicación y los JWT se firman para detectar modificaciones.
- Fuera de ese entorno de pruebas, la autenticación con estas cookies requiere HTTPS. Este cambio no configura certificados ni modifica el arranque HTTP existente de Spring o Vite.
- `JWT_SECRET` debe ser un secreto aleatorio privado de al menos 32 bytes en el despliegue. Si no se configura, se genera una clave local aleatoria al arrancar y los tokens previos dejan de ser válidos después de reiniciar.

## CSRF

Spring Security mantiene una cookie CSRF HttpOnly y el cliente obtiene su representación en `GET /api/v1/auth/csrf`. Antes de un POST, PUT o DELETE, el cliente consulta ese endpoint y envía el valor devuelto mediante `X-CSRF-TOKEN`. El token CSRF no es un JWT y no identifica al usuario.

Se mantiene el tratamiento enmascarado de tokens de Spring Security. Registro, login, renovación, logout y cambios de perfil también requieren CSRF. No se han añadido excepciones por utilizar JWT ni se ha reintroducido CORS. Las respuestas de autenticación no se almacenan en caché.

En desarrollo, abrir el frontend y utilizar su proxy `/api` hacia Spring. Mantener el mismo host al navegar: `localhost` y `127.0.0.1` no comparten cookies.

## Endpoints

| Endpoint | Comportamiento |
|---|---|
| `GET /api/v1/auth/csrf` | Devuelve `headerName` y `token` para la siguiente escritura. |
| `POST /api/v1/auth/login` | Recibe correo y contraseña; devuelve 204 y establece las cookies JWT. |
| `POST /api/v1/auth/refresh` | Lee únicamente la cookie de renovación; devuelve 204 y actualiza las cookies. |
| `POST /api/v1/auth/logout` | Devuelve 204 y elimina las cookies, incluso si el access token ha caducado. |

El frontend intenta renovar una vez cuando una petición protegida recibe 401 y repite la petición original. Una respuesta 403 por CSRF o permisos no desencadena renovación. Logout elimina las cookies del navegador; no incorpora una lista de revocación de JWT emitidos. La eliminación de cuenta deshabilita al usuario y elimina las cookies de autenticación.

## Pruebas y evolución móvil

Las pruebas HTTP comprueban los atributos de las cookies, rechazo de Bearer y de refresh en JSON, CSRF ausente o incorrecto, renovación, logout y roles. Las pruebas de navegador comprueban el flujo web; las de integración Node utilizan un almacén de cookies porque `fetch` de Node no incorpora el del navegador.

Cuando se desarrolle Expo se podrá añadir un mecanismo Bearer específico para el móvil con almacenamiento seguro del dispositivo. No se ha habilitado esa alternativa ni se ha desactivado CSRF para anticiparla. La lógica de usuarios y JWT sigue separada del transporte de cookies.

Referencia: [protección CSRF de Spring Security](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html).
