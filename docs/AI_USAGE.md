# Uso de herramientas de IA

## Fase 1

- **Fecha:** 13 de septiembre de 2026
- **Objetivo:** Indagar en el proyecto y posibles opciones de implementación.
- **Herramienta:** Perplexity
- **Configuración de la herramienta:** Modo gratuito
- **Cómo ha sido usada:** Se le ha pasado un contexto de la idea y se ha pedido que indague en la misma: distintas posibilidades, tecnologías posibles a utilizar para el desarrollo, viabilidad y costes, además de proporcionar varios posibles ejemplos de funcionamiento. Este uso se ha basado en organizar y dar nombre y contexto a la idea completa, así como materializarla con varios ejemplos y consultar herramientas y viabilidad.

<br>

- **Fecha:** 15 de septiembre de 2026
- **Objetivo:** Realizar la estructura básica del README.md
- **Herramienta:** Gemini
- **Configuración de la herramienta:** Modo pro
- **Cómo ha sido usada:** Se le ha proporcionado el documento del enunciado del TFG y se ha pedido que realice un esquema en Markdown con todas las secciones que debe contener el README.md en su primera fase para posteriormente completarlas.

## Fase 2

- **Fecha:** 17 de septiembre de 2026
- **Objetivo:** Creación de la estructura del proyecto
- **Herramienta:** Codex
- **Configuración de la herramienta:** Modo plus, 6 Astra Light.
- **Cómo ha sido usada:** Se ha utilizado para revisar el README.md de la fase 1 y realizar una estructura base del proyecto con todos los archivos de configuración de Spring Boot, React y MySQL, además de proporcionar la separación de la lógica básica de la aplicación en carpetas.

<br>

- **Fecha:** 20 de septiembre de 2026
- **Objetivo:** Verificación de la funcionalidad inicial
- **Herramienta:** Codex
- **Configuración de la herramienta:** Modo plus, 6 Sol Medium.
- **Cómo ha sido usada:** Tras realizar la implementación básica del backend y frontend, se ha pedido a Codex que revise toda la implementación y realice mejoras sugeridas. Tras corregir algunos errores, Codex proporciona una implementación mucho más avanzada, utilizando sistemas de migración de bases de datos como Flyway, y elementos avanzados de Spring como perfiles o transacciones. Se revisa todo minuciosamente y se elimina todo lo que en primera instancia es demasiado avanzado para esta primera parte del proyecto y se verifica que todo siga funcionando correctamente.

<br>

- **Fecha:** 7 de octubre de 2026
- **Objetivo:** Comprender e implementar la estrategia de pruebas automáticas de la fase 2.
- **Herramienta:** Codex
- **Configuración de la herramienta:** Modo plus, Sol Medium.
- **Cómo ha sido usada:** Se ha utilizado para explicar las diferencias entre pruebas unitarias, de integración y de sistema, proponer la organización de los ficheros y revisar la implementación. También ha ayudado a configurar JUnit, Mockito, Vitest, Testing Library, Testcontainers, Rest Assured y Selenium, y a interpretar los errores encontrados durante la ejecución. Cada prueba se ha ejecutado y revisado antes de incorporarla mediante pull request.

<br>

- **Fecha:** 10 de octubre de 2026
- **Objetivo:** Configurar la medición de cobertura del backend y frontend.
- **Herramienta:** Codex
- **Configuración de la herramienta:** Modo plus, Sol Medium.
- **Cómo ha sido usada:** Se ha solicitado la configuración de JaCoCo para Maven y del proveedor V8 de Vitest. Codex ha explicado las métricas de instrucciones, líneas, métodos, funciones y ramas, ha generado los comandos de ejecución y ha comprobado que los informes HTML se producían sin imponer un umbral no requerido en esta fase.

<br>

- **Fecha:** 17 de octubre de 2026
- **Objetivo:** Configurar la integración continua y completar la documentación de la fase 2.
- **Herramienta:** Codex
- **Configuración de la herramienta:** Modo plus, Sol High - Medium.
- **Cómo ha sido usada:** Se ha utilizado para definir los controles básico y completo de GitHub Actions, explicar la protección de la rama `main`, auditar los requisitos documentales del enunciado, reorganizar el README y redactar la guía de desarrollo.

