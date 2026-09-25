# Registro de cambios

Todos los cambios notables del proyecto se documentarán en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el proyecto utiliza [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Añadido

- Estructura inicial del proyecto separada en `backend` y `frontend`.
- API REST desarrollada con Java, Spring Boot y una arquitectura por capas.
- Entidad principal `Challenge`, repositorio JPA, servicio, DTO y mapper de MapStruct.
- Persistencia local con MySQL y configuración mediante variables de entorno.
- Carga inicial de tres retos de ejemplo en una base de datos vacía.
- Endpoint `GET /api/v1/challenges` para recuperar los retos ordenados por identificador.
- Especificación OpenAPI en YAML y documentación navegable en HTML dentro de `docs/api`.
- Cliente web SPA desarrollado con React, TypeScript y React Router Framework Mode.
- Página principal que obtiene los retos mediante la API REST y muestra su información básica.
- Estados de carga, lista vacía y error para la consulta de retos.
- Guía de desarrollo y registro del uso de herramientas de inteligencia artificial.

[Sin publicar]: https://github.com/codeurjc-students/2026-Flashing/commits/main
