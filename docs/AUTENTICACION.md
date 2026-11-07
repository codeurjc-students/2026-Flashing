# Autenticación y seguridad

La web y la app móvil comparten usuarios y permisos. Spring Security comprueba
la contraseña al entrar. El backend crea una sesión en MySQL y emite un JWT
de acceso y otro de renovación. Cada inicio de sesión crea una fila independiente.

## Sesión, renovación y revocación

Los JWT incluyen el identificador de sesión `sid` y un identificador de token
`jti`. La fila de sesión guarda su vencimiento y el `jti` de la renovación
vigente. MySQL guarda identificadores, no los JWT completos ni las contraseñas.

- El acceso dura 15 minutos por defecto. En cada petición protegida, el filtro
  valida la firma, el vencimiento y el tipo del JWT, consulta que la sesión siga
  activa y comprueba el usuario y sus permisos actuales.
- La renovación dura 7 días por defecto. Al renovarla se bloquea la fila en una
  transacción. El backend compara el `jti` recibido con el vigente, genera
  nuevos tokens y guarda el nuevo `jti` y vencimiento.
- Si se vuelve a presentar una renovación firmada y aún no caducada que ya se
  usó, el backend borra la sesión y responde 401. El borrado se confirma aunque
  la respuesta sea un error. La renovación más reciente y todos los accesos
  de esa sesión dejan de servir.
- El cierre también borra la sesión. Las peticiones protegidas que lleguen
  después de confirmarse el borrado reciben 401 si usan esos tokens.
  Una petición que ya superó la autenticación puede terminar.
  Otras sesiones del mismo usuario siguen activas.

El cierre es idempotente. Un token firmado de la sesión, incluso si ha caducado,
puede identificarla para revocarla. Los tokens caducados solo se aceptan para
ese propósito. El bloqueo de fila serializa el cierre y la renovación.
Esta rotación sigue el principio de detección de reutilización descrito en el
[RFC 9700, sección 4.14](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14).

Hibernate crea la tabla de sesiones con la configuración actual
`spring.jpa.hibernate.ddl-auto=update`. Al aplicar el cambio, los JWT anteriores
sin `sid` requieren volver a iniciar sesión. Configura un `JWT_SECRET` privado
y estable de al menos 32 bytes para conservar sesiones entre reinicios. Con la
clave local aleatoria, reiniciar invalida los JWT anteriores.

## Cliente web

El navegador recibe los JWT mediante cookies, con `HttpOnly`, `SameSite=Strict`
y `Secure` por defecto. `AuthToken` tiene ruta `/api` y `RefreshToken` tiene ruta
`/api/v1/auth`. El código del cliente no lee los JWT ni los guarda en
`localStorage`. HTTPS protege los datos en tránsito. El atributo `Secure`
limita el envío de la cookie a conexiones que el navegador considera seguras.

Las escrituras con cookies requieren CSRF. La web consulta
`GET /api/v1/auth/csrf` para obtener el nombre de cabecera y el valor enmascarado.
Después envía ese valor en `X-CSRF-TOKEN` junto con la cookie CSRF. El servidor
comprueba que coincidan. El acceso, la renovación y el cierre web mantienen
esta comprobación incluso si llega una cabecera Bearer.

| Endpoint web | Petición y respuesta |
|---|---|
| `GET /api/v1/auth/csrf` | 200 con `headerName` y `token`. |
| `POST /api/v1/auth/login` | Correo, contraseña y CSRF. 204 con las cookies JWT. |
| `POST /api/v1/auth/refresh` | Cookie de renovación y CSRF. 204 con las cookies rotadas. |
| `POST /api/v1/auth/logout` | Cookies y CSRF. Revoca la sesión y devuelve 204 al limpiar las cookies. |

Ante un 401 de una petición protegida, el cliente comparte una promesa de
renovación entre las peticiones de la misma pestaña y reintenta una vez.
Una petición que recibe un 401 tardío aprovecha una renovación ya terminada.
Si el navegador ofrece Web Locks, las pestañas del mismo origen serializan
la renovación y el cierre. Antes de renovar dentro del bloqueo, se comprueba
si otra pestaña ya recuperó un acceso válido. Sin Web Locks, la coordinación
es por pestaña y el backend sigue aplicando la detección de reutilización.

En desarrollo, la web usa el proxy `/api` hacia Spring. Mantén el mismo host
al navegar, ya que `localhost` y `127.0.0.1` tienen cookies distintas.
Los servidores de prueba con Testcontainers desactivan `Secure` en su
configuración de pruebas para trabajar sobre HTTP.

## Cliente móvil

| Endpoint móvil | Petición y respuesta |
|---|---|
| `POST /api/v1/auth/mobile/login` | JSON con correo y contraseña. 200 con `accessToken` y `refreshToken`. |
| `POST /api/v1/auth/mobile/refresh` | JSON con `refreshToken`. 200 con los nuevos tokens. |
| `POST /api/v1/auth/mobile/logout` | JSON con `refreshToken`. Revoca la sesión y devuelve 204. |

La app mantiene el acceso en memoria y guarda la renovación en Expo SecureStore,
bajo la clave `flashing.refreshToken`. Envía
`Authorization: Bearer <accessToken>` para las peticiones protegidas.
Los endpoints móviles de autenticación y las peticiones Bearer no necesitan
CSRF porque usan credenciales explícitas. Si se presenta una cabecera
`Authorization`, el filtro no usa las cookies como alternativa.
Las respuestas de autenticación se marcan como `no-store`.

Al arrancar, `MobileSessionProvider` llama a `restoreSession()`. Si la clave
no existe, deja el usuario vacío. Si existe, intenta consultar
`/api/v1/users/me`. Tras reiniciar la app, el acceso ya no está en memoria y
la consulta primero renueva con el token guardado. El proveedor espera ese
resultado antes de habilitar el acceso. Una renovación rechazada con 401
borra los tokens. Si falla la red, conserva la renovación y permite volver
a intentar el acceso.

`refreshing` guarda la promesa de renovación. La primera petición inicia la
operación y las demás esperan esa misma promesa. `finally` libera la variable
al terminar. Cada petición recuerda el acceso que utilizó. Si recibe un 401
cuando otra petición ya ha renovado, reintenta con el acceso nuevo y evita
otra rotación.

Al cerrar sesión, `closing` comparte la operación de cierre e impide iniciar
nuevas renovaciones. La app espera una renovación en curso, lee el último
token guardado y solicita la revocación. Tras el 204 borra las credenciales
locales y limpia el usuario. Si no hay token guardado, solo limpia el estado
local. Si falla la conexión al cerrar, mantiene la sesión local y muestra un
mensaje para reintentar.

El cliente acepta HTTP cuando `__DEV__` está activo. En una compilación nativa,
`APP_VARIANT=development` habilita también el tráfico local en Android e iOS.
En producción, `EXPO_PUBLIC_API_URL` debe usar HTTPS. Consulta la
[guía móvil](../mobile/README.md) para la configuración de cada entorno.

## Estados de las peticiones

| Estado | Qué significa en Flashing |
|---|---|
| 200 OK | La petición devolvió datos, como el perfil, el token CSRF o los tokens móviles. |
| 201 Created | Se creó el recurso, por ejemplo una cuenta. |
| 204 No Content | La operación terminó y la respuesta no lleva JSON. Ejemplos: cierre de sesión, acceso web y renovación web. |
| 400 Bad Request | JSON inválido o campos que no cumplen la validación. Un cuerpo de renovación móvil sin token también produce 400. |
| 401 Unauthorized | Credenciales incorrectas al entrar, o credencial ausente, inválida, caducada o revocada en una petición protegida. Una renovación reutilizada también produce 401 y revoca la sesión. |
| 403 Forbidden | Permisos insuficientes o CSRF ausente o incorrecto. Los clientes no renuevan ante un 403. |
| 404 Not Found | Ruta o recurso inexistente. En rutas protegidas, la seguridad puede responder antes de buscar el recurso. |
| 405 Method Not Allowed | El método HTTP no corresponde a la ruta. |
| 409 Conflict | El estado actual impide la operación, como un correo o nombre de usuario ya registrado. |
| 415 Unsupported Media Type | El formato del cuerpo no es compatible con la operación. Enviar JSON con `Content-Type: application/json` cuando se requiera. |
| 500 Internal Server Error | Fallo inesperado del servidor. Los detalles se consultan en sus registros. |
| Sin respuesta HTTP | Fallo de conexión, DNS, TLS o cancelación. El cliente móvil cancela las peticiones que superan 15 segundos. |

Los errores gestionados por la API usan `timestamp`, `status`, `error`,
`message`, `path` y `fieldErrors`. `fieldErrors` identifica los campos que
fallaron la validación. Algunos rechazos del filtro de seguridad devuelven
solo `message`. El código HTTP y el endpoint permiten interpretar el error,
aunque el cuerpo tenga menos campos.

## Cuentas de prelanzamiento

La raíz `/` muestra la landing pública. `/register` permite crear una cuenta y `/login` da acceso a `/welcome`, una pantalla de espera del lanzamiento. `/profile` redirige a esta pantalla; la web pública no incluye las funciones de la futura aplicación móvil.

El registro admite una única opción voluntaria: `launchUpdates` para recibir un correo cuando se lance Flashing. Si se omite, el aviso queda desactivado. Se guarda en MySQL junto con la fecha de activación del consentimiento. El usuario puede cambiar su elección mediante `PUT /api/v1/users/me/notifications`, protegido por autenticación y CSRF, o eliminar su cuenta para cancelar el aviso. No hay suscripciones a promociones ni novedades.

El registro no envía correos ni verifica la titularidad del email. Al llegar el lanzamiento se utilizarán las direcciones de los usuarios activos que mantengan `launchUpdates` activado para gestionar manualmente el envío de un único correo genérico. Esta implementación no añade un exportador ni un servicio automático de envío. Los botones de las tiendas indican que la app todavía no está publicada.

## Pruebas

Las pruebas de sistema cubren el acceso con cookies, CSRF, Bearer, permisos,
renovación concurrente, revocación de tokens copiados y cierre por sesión.
Las pruebas unitarias de la web comprueban que varias respuestas 401
compartan una renovación.

Referencia [protección CSRF de Spring Security](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html).
