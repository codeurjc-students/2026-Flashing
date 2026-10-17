# Seguimiento del desarrollo

[Volver al índice principal](../README.md#documentación)

## Gestión de tareas

El desarrollo se organiza mediante GitHub Issues. Cada issue describe una unidad de trabajo, sus criterios de aceptación y la relación con la fase correspondiente. Cuando una tarea requiere cambios en el repositorio, se vincula con una pull request mediante `Closes #N` para que GitHub cierre el issue automáticamente al fusionar la PR.

Las tareas se representan visualmente en GitHub Project con estados equivalentes a:

- **Todo:** tarea definida que todavía no ha comenzado.
- **In progress:** tarea con una rama activa y trabajo en curso.
- **In review:** tarea con una pull request abierta.
- **Done:** tarea fusionada, verificada y documentada.

Una funcionalidad no debe pasar a `Done` si sus pruebas o controles de integración continua no son correctos.

## Estrategia de ramas

- `main`: código estable e integrado.
- `feature/<nombre>`: nuevas funcionalidades y cambios técnicos.
- `fix/<nombre>`: correcciones de errores.
- `docs/<nombre>`: cambios exclusivamente documentales.

Los cambios se realizan mediante pull request. El control completo de GitHub Actions debe pasar antes de permitir el merge en `main`.

## Seguimiento de la fase 2

Durante la fase 2 se han gestionado mediante issues y pull requests la inicialización de pruebas, las integraciones con MySQL y la API, las pruebas de sistema, la cobertura y GitHub Actions.

Al incorporar la corrección final de cierre de la fase 2, el repositorio alcanza las siguientes métricas:

- **15 commits** incorporados a `main`.
- **11 pull requests** fusionadas.
- **9 issues** utilizados para organizar el trabajo, todos cerrados.
- **11 ramas de trabajo** empleadas para desarrollar pruebas, cobertura, integración continua, documentación y la limpieza final, sin contar `main`.

Las cifras incluyen la pull request final de limpieza y actualización de métricas. Las ramas fusionadas se eliminan para mantener el repositorio ordenado; su trabajo continúa disponible en el historial de `main` y en las pull requests cerradas.

## Enlaces

- [Issues del proyecto](https://github.com/codeurjc-students/2026-Flashing/issues)
- [Pull requests del proyecto](https://github.com/codeurjc-students/2026-Flashing/pulls)
- [Actions del proyecto](https://github.com/codeurjc-students/2026-Flashing/actions)
