# Delicias del Sur - Frontend React

Plataforma web de comercio electrónico y panel de administración para **Delicias del Sur**, tienda de productos artesanales y conservas del sur de Chile.

Proyecto de **Evaluación Parcial 3** de **DSY1104 – Desarrollo Fullstack II** (DuocUC).

## Integrantes

- Jhoander Briceño
- José Cuevas
- Gonzalo Sandoval

## Tecnologías

- React 19 y Vite
- React Router DOM 7
- Bootstrap 5.3 (diseño responsivo)
- Axios con interceptores JWT (`Authorization: Bearer <token>`)
- Context API para el estado global (`SesionContexto` y `CarritoContexto`)
- Jasmine y Karma para pruebas unitarias con reporte de cobertura

## Arquitectura e integración con API Gateway

El frontend **no se comunica directamente con el backend** (`8081`), sino exclusivamente a través del **API Gateway** (`8080`) usando la ruta pública `/delicias/v1`:

```text
Frontend React (5173) ---> API Gateway (8080 /delicias/v1) ---> Backend Spring Boot (8081 /api/v1) ---> MySQL (3306)