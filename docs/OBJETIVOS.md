# Objetivos

[Volver al índice principal](../README.md#documentación)

## Objetivos funcionales

Flashing pretende ofrecer una experiencia social diaria basada en retos creativos breves. El cliente móvil permitirá participar en los flashes, conservar un historial personal e interactuar con amistades. El cliente web permitirá administrar el contenido y supervisar el funcionamiento de la plataforma.

### Cliente móvil

- Consultar el flash activo y recibir una notificación cuando comience.
- Resolver el flash activo en el formato y tiempo indicados.
- Consultar el historial personal de respuestas o *memories*.
- Consultar estadísticas personales y rachas de participación.
- Gestionar amistades, solicitudes y bloqueos.
- Configurar el perfil y la privacidad de las respuestas.
- Reportar contenido inapropiado.
- Consultar y reaccionar a respuestas de amistades.

### Cliente web

- Crear, editar, activar y desactivar flashes.
- Programar la publicación de flashes.
- Administrar categorías y temporadas.
- Revisar usuarios y estadísticas de uso.
- Moderar contenido y gestionar reportes.
- Configurar la rotación de flashes.
- Proporcionar un modo de demostración para facilitar la depuración.

## Objetivos técnicos

El proyecto busca aplicar una arquitectura profesional, mantenible y escalable que pueda evolucionar desde una funcionalidad mínima hasta una aplicación web y móvil completa. Se priorizan tecnologías gratuitas o de coste reducido y mecanismos de calidad automatizados.

- Desarrollar una API REST con Java y Spring Boot.
- Desarrollar un cliente web SPA con React y TypeScript.
- Desarrollar posteriormente un cliente móvil con React Native y Expo.
- Utilizar MySQL como sistema de persistencia relacional.
- Separar controladores, servicios, repositorios, DTO y mapeadores.
- Documentar la API mediante OpenAPI.
- Aplicar pruebas unitarias, de integración y de sistema desde el inicio.
- Automatizar los controles de calidad mediante GitHub Actions.
- Diseñar el sistema para que pueda desplegarse con un coste inicial mínimo y escalar posteriormente.
- Incorporar inteligencia artificial como apoyo para proponer variantes de retos, sin convertirla en una dependencia del funcionamiento principal.
