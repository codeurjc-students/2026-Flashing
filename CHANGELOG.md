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
- Prueba unitaria del servicio del backend con JUnit y Mockito.
- Pruebas unitarias del componente de retos con Vitest, Testing Library y JSDOM.
- Prueba de integración entre servicio, repositorio y MySQL mediante Testcontainers.
- Prueba de integración entre el cliente y la API REST real.
- Prueba de sistema de la API REST con Rest Assured.
- Prueba de sistema de la interfaz web con Selenium y Chrome.
- Medición de cobertura del backend mediante JaCoCo.
- Medición de cobertura del frontend mediante Vitest y V8.
- Workflow básico de GitHub Actions para compilar y ejecutar pruebas unitarias en ramas de funcionalidad.
- Workflow completo de GitHub Actions para ejecutar todas las pruebas en pull requests hacia `main`.
- Documentación de fase 2 dividida por objetivos, metodología, funcionalidades, análisis, seguimiento, desarrollo y autoría.
- Colección de Postman con ejemplos de uso de la API REST.
- Guía de desarrollo actualizada con arquitectura, tecnologías, pruebas, cobertura, CI y ejecución local.
- Registro del uso de herramientas de inteligencia artificial.

### Corregido

- Año del diagrama de Gantt actualizado de 2025 a 2026.
- Errores tipográficos y referencias desactualizadas de la documentación inicial.
- Eliminada una clase de prueba vacía y duplicada incorporada accidentalmente durante la reorganización documental.
- Actualizadas las métricas finales de commits, ramas, issues y pull requests de la fase 2.

[Sin publicar]: https://github.com/codeurjc-students/2026-Flashing/commits/main
