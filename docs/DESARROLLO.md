# Guía de desarrollo

## Alcance actual

El proyecto contiene un backend Spring Boot que expone únicamente una API REST, un frontend React y una conexión a MySQL. La funcionalidad inicial lista plantillas de retos. Por ahora no se han configurado pruebas automáticas, Docker, integración continua ni migraciones de base de datos.

## Requisitos

- Java 21 y Maven.
- Node 22.12 o superior y npm.
- MySQL instalado y ejecutándose en el equipo.

## Preparar MySQL

Crea una base y un usuario local. Estos valores coinciden con `.env.example`:

```sql
CREATE DATABASE flashing;
CREATE USER 'flashing'@'localhost' IDENTIFIED BY 'flashing_local';
GRANT ALL PRIVILEGES ON flashing.* TO 'flashing'@'localhost';
```

Puedes cambiar los valores copiando `.env.example` a `.env`. `.env` no se guarda en Git.

Hibernate utiliza `spring.jpa.hibernate.ddl-auto=update`: al iniciar el backend crea las tablas que falten y trata de actualizar las existentes para que correspondan con las entidades. Esto facilita el desarrollo inicial. No proporciona un historial controlado de cambios; ese problema se abordará cuando el modelo empiece a estabilizarse.

## Ejecutar el backend

Desde la raíz:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
mvn -f backend/pom.xml spring-boot:run
```

La API queda disponible en http://localhost:8080. Para consultar los retos:

```bash
curl http://localhost:8080/api/v1/challenges
```

`DatabaseInitializer` introduce tres retos si la tabla está vacía.

## Ejecutar el frontend

En otra terminal:

```bash
nvm install
nvm use
npm --prefix frontend install
npm --prefix frontend run dev
```

Abre http://localhost:5173. React Router funciona en modo SPA y Vite reenvía las rutas que comienzan por `/api` al backend en el puerto 8080. La página inicial ejecuta su `clientLoader` para recuperar los retos.

## Configuración

`application.properties` importa opcionalmente `.env`. Las variables disponibles son:

| Variable | Valor predeterminado |
| --- | --- |
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_NAME` | `flashing` |
| `DB_USERNAME` | `flashing` |
| `DB_PASSWORD` | `flashing_local` |
| `DB_URL` | URL JDBC construida con los valores anteriores |
| `SERVER_PORT` | `8080` |

Los valores predeterminados son únicamente para desarrollo local. En un despliegue se proporcionarán credenciales mediante el entorno.

## Comprobaciones disponibles

Aunque todavía no hay tests, se puede comprobar que ambos proyectos compilan:

```bash
mvn -f backend/pom.xml package
npm --prefix frontend run build
```
