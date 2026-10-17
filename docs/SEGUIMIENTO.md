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

Al cierre técnico de la fase 2, `main` contiene 13 commits y 9 cambios incorporados mediante pull request. Estas métricas representan el estado del repositorio antes de integrar esta actualización documental.

## Enlaces

- [Issues del proyecto](https://github.com/codeurjc-students/2026-Flashing/issues)
- [Pull requests del proyecto](https://github.com/codeurjc-students/2026-Flashing/pulls)
- [Actions del proyecto](https://github.com/codeurjc-students/2026-Flashing/actions)
