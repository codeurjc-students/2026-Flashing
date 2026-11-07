# Cliente móvil

Desde esta carpeta, instalar con `npm ci` e iniciar con `npm start`.
Spring Boot debe estar ejecutándose en el puerto 8080.

En Expo Go, la app obtiene automáticamente el host de Metro para conectar
con el backend por HTTP durante el desarrollo. El Mac y el teléfono deben
estar en la misma red y el puerto 8080 debe ser accesible.

Para elegir otra dirección, definir `EXPO_PUBLIC_API_URL` en `.env`.
En el emulador Android se puede usar `http://10.0.2.2:8080`.
En un teléfono físico se usa la IP del Mac.
Después de cambiar la dirección, recargar completamente la app.

En producción, `EXPO_PUBLIC_API_URL` es obligatorio y debe utilizar HTTPS
con un certificado válido. El cliente rechaza HTTP en una compilación de producción.
Las compilaciones nativas bloquean HTTP por defecto. Para una compilación
nativa local de desarrollo, usar `APP_VARIANT=development npx expo run:android`
o `APP_VARIANT=development npx expo run:ios`.
Expo Go permite utilizar la conexión local directamente.

El acceso móvil usa `POST /api/v1/auth/mobile/login`, que devuelve dos tokens.
El de acceso se mantiene en memoria y el de renovación se guarda en SecureStore.
Las peticiones autenticadas incluyen `Authorization: Bearer …`.
La renovación utiliza `POST /api/v1/auth/mobile/refresh` con el token de renovación.
Al abrir la app se intenta restaurar la sesión desde SecureStore.
`POST /api/v1/auth/mobile/logout` revoca la sesión en el servidor. Tras la
confirmación, la app elimina los tokens del dispositivo. Los tokens copiados
de esa sesión dejan de autorizar peticiones protegidas.

Consulta [autenticación y seguridad](../docs/AUTENTICACION.md) para ver la
rotación, la concurrencia y los estados de error.

Para conservar las sesiones entre reinicios del backend, configurar
un `JWT_SECRET` privado y estable de al menos 32 bytes. Con la clave
aleatoria local, el reinicio del servidor requiere volver a iniciar sesión.
