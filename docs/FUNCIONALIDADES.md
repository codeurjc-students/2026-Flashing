# Funcionalidades detalladas

[Volver al índice principal](../README.md#documentación)

Las funcionalidades se organizan por nivel de madurez. Su inclusión en este documento expresa el alcance previsto; salvo la consulta mínima de retos indicada expresamente, no implica que ya estén implementadas.

## Funcionalidad básica

### Usuario no registrado

- Consultar la pantalla pública de bienvenida.
- Ver un tutorial y ejemplos de funcionamiento.
- Consultar información sobre privacidad y normas de la comunidad.
- Acceder al registro y al inicio de sesión.
- Consultar información de contacto y soporte.

### Usuario registrado

- Crear una cuenta, iniciar sesión y cerrar sesión.
- Consultar, editar y eliminar su perfil.
- Consultar el flash actual y recibir su notificación.
- Responder al flash actual dentro del tiempo disponible.
- Consultar y eliminar sus propias respuestas.
- Configurar la privacidad de sus respuestas.
- Gestionar solicitudes de amistad y amistades.
- Bloquear usuarios y reportar contenido.

### Administrador

- Iniciar sesión en el cliente web.
- Crear, editar, activar y desactivar retos.
- Programar el próximo flash.
- Revisar y administrar usuarios.
- Moderar contenido y resolver reportes.
- Consultar estadísticas básicas.

### Flash básico: doble fotografía instantánea

El usuario realizará dos fotografías en el momento: una con la cámara frontal y otra con la cámara trasera. Dispondrá de una repetición dentro del tiempo límite.

### Funcionalidad mínima implementada en la fase 2

La página principal del cliente web consulta la API REST y muestra tres plantillas de reto almacenadas en MySQL. Esta funcionalidad demuestra la comunicación completa entre React, Spring Boot y la base de datos, pero no representa todavía el flujo funcional final del producto.

## Funcionalidad intermedia

### Tipos de flash adicionales

- **Dibujo rápido:** el sistema muestra una temática y un tiempo limitado para realizar un boceto.
- **Audio breve:** el usuario graba una respuesta corta relacionada con una temática.
- **Fotografía guiada:** el sistema proporciona una instrucción que debe cumplirse en una fotografía.
- **Texto breve:** el usuario responde con un texto limitado por longitud o tiempo.

### Participación y fidelización

- Programación y activación automática del flash diario.
- Participación tardía identificada de forma visible y susceptible de quedar excluida de reacciones o votaciones.
- Sistema de rachas para incentivar la participación.
- Historial personal o *memories*.
- Notificaciones del flash diario, interacciones y solicitudes de amistad.

## Funcionalidad avanzada

### Rotación inteligente de flashes

El sistema seleccionará retos considerando el uso anterior, el tiempo transcurrido desde la última aparición de una categoría, los formatos recientes, la dificultad, la duración y la temporada.

### Inteligencia artificial

La inteligencia artificial podrá proponer variantes y generar borradores de retos a partir de instrucciones. El funcionamiento principal de la aplicación no dependerá de la disponibilidad de ese servicio.

### Moderación y análisis

- Sistema completo de reportes y moderación.
- Estadísticas globales y personales.
- Reacciones a respuestas de la comunidad.
- Análisis de participación, tiempos y popularidad de categorías.
