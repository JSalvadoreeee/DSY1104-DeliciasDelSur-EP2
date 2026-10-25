# Delicias del Sur

Plataforma web y panel de administración para **Delicias del Sur**, una fábrica de conservas del sur de Chile. Incluye una tienda pública y un panel privado con control de calidad de lotes.

Proyecto de la **Evaluación Parcial 2** de **DSY1104 – Desarrollo Fullstack II** (DuocUC).

## Integrantes

- Jhoander Briceño
- José Cuevas
- Gonzalo Sandoval

## Tecnologías

- React 19 y Vite
- React Router DOM 7
- Bootstrap 5.3 (diseño responsivo)
- Context API para el estado global (sesión y carrito)
- Jasmine y Karma para las pruebas unitarias, con `karma-coverage` para la cobertura

## Cómo ejecutar el proyecto

Requisitos: Node.js 20.19 o superior (probado con Node 24) y Google Chrome para las pruebas.

```bash
git clone https://github.com/JSalvadoreeee/DSY1104-DeliciasDelSur-EP2.git
cd DSY1104-DeliciasDelSur-EP2
npm install
npm run dev
```

La app queda en `http://localhost:5173/`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el proyecto en modo desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm test` | Corre las pruebas con Karma y genera el reporte de cobertura |

## Usuario administrador de prueba

Para entrar al panel de administración:

- Correo: `admin@deliciasdelsur.cl`
- Contraseña: `admin1234`

Son datos de prueba para esta evaluación.

## Vistas

**Tienda pública**

- `/` Home con carrusel y categorías
- `/productos` y `/producto/:id` catálogo con filtros y detalle
- `/categorias` y `/categoria/:nombre`
- `/ofertas`
- `/carrito`, `/checkout`, `/pago-exitoso` y `/pago-error`
- `/registro` y `/login`
- `/nosotros`, `/blogs`, `/blog/:id` y `/contacto`

**Panel de administración** (solo rol admin)

- `/admin` dashboard
- `/admin/productos` CRUD de productos
- `/admin/lotes` control de calidad de lotes
- `/admin/usuarios` CRUD de usuarios
- `/admin/reportes` reportes con productos críticos
- `/admin/perfil` perfil del administrador

## Estructura del proyecto

```text
src/
├── componentes/   Navbar, Footer y ruta protegida del admin
├── contexto/      Estado global: sesión y carrito
├── datos/         Fuentes de datos simuladas con CRUD (productos, usuarios, lotes y blogs)
├── paginas/
│   ├── tienda/    Vistas públicas
│   └── admin/     Vistas del panel de administración
├── pruebas/       Pruebas unitarias con Jasmine y Karma
└── utilidades/    Validaciones (RUN con Módulo 11, correo y contraseña)
```

## Control de calidad de lotes

Cada lote se mide con uno de estos parámetros: pH, °Brix, acidez, humedad o microbiología. Las reglas son:

- Un lote no puede marcarse **Conforme** si el valor medido está fuera del rango permitido.
- Un lote **No conforme** exige observaciones.
- Los estados posibles son Conforme, No conforme y En revisión.

## Datos y persistencia

Los datos viven en archivos JavaScript que simulan una base de datos con CRUD (`src/datos`).

- Los **usuarios y la sesión** se guardan en `localStorage`.
- Los **productos, lotes y el carrito** se mantienen en memoria, así que vuelven a sus valores iniciales al recargar la página.

## Pruebas unitarias

El proyecto tiene **46 pruebas** con Jasmine, ejecutadas con Karma en Chrome Headless. Cubren:

- Validaciones de formularios (RUN, correo, contraseña y nombre)
- CRUD de productos, usuarios y lotes, y reglas de calidad
- Sesión global: iniciar sesión, actualizar perfil y cerrar sesión
- Componentes: Productos, Carrito, Login y la ruta protegida del admin

Las pruebas usan un espía de Jasmine (`spyOn`) como mock de `localStorage`.

Para correrlas:

```bash
npm test
```

El reporte de cobertura queda en `coverage/html/index.html`. En la última ejecución dio 94,8 % de statements, 87,2 % de branches, 90,9 % de funciones y 97,4 % de líneas.