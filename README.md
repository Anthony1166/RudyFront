# Rudy Frontend (Angular)

Este es el repositorio del frontend para el **Proyecto Sami**, desarrollado utilizando **Angular** y **Tailwind CSS**. Contiene tanto la interfaz pública para visualizar el portafolio (proyectos, productos, categorías) como un panel de administración protegido para gestionar el contenido.

## 🛠️ Tecnologías Utilizadas

- **Framework:** Angular 20.1
- **Estilos:** Tailwind CSS 4
- **Lenguaje:** TypeScript
- **Gestión de Estado y Peticiones:** RxJS y HttpClient
- **Enrutamiento:** Angular Router (Stand-alone components)

## 📂 Estructura del Proyecto

La aplicación está modularizada en componentes independientes (standalone), ubicados en `src/app`:

```text
src/app/
├── components/
│   ├── admin-component/   # Panel de administración protegido (Dashboard)
│   ├── categoria/         # ABM (Alta, Baja, Modificación) de Categorías
│   ├── home-component/    # Vistas públicas (Inicio, Detalles, Categorías)
│   ├── imagen-component/  # ABM de Imágenes
│   ├── login/             # Pantalla de autenticación para administradores
│   ├── prod/              # Componentes relacionados a la gestión de Productos
│   ├── proyecto-component/# ABM de Proyectos
│   └── testing-component/ # Componente para pruebas
├── model/                 # Interfaces y modelos de TypeScript (Proyecto, Producto, etc.)
├── services/              # Servicios para consumir la API y el AuthGuard
└── app.routes.ts          # Configuración principal de enrutamiento
```

## 🛣️ Enrutamiento Principal (`app.routes.ts`)

### Rutas Públicas
- `/` o `/Home` - Página de inicio del portafolio.
- `/Proyectos` - Vista de perfil y listado de proyectos.
- `/proyecto/detalle/:id` - Detalles de un proyecto específico.
- `/Categorias` - Listado de categorías de productos.
- `/categoria/:slug` - Vista de productos filtrados por una categoría.
- `/producto/:id` - Detalles de un producto.
- `/login` - Acceso al panel de administración.

### Rutas de Administración (`/administracion/...`)
Protegidas por `AuthGuard`, requieren inicio de sesión válido.
- Redirección por defecto a: `/administracion/proyecto/listar`.
- **Proyectos:** `/proyecto/listar`, `/proyecto/registrar`, `/proyecto/actualizar/:id`.
- **Categorías:** `/categoria/listar`, `/categoria/registrar`, `/categoria/actualizar/:id`.
- **Imágenes:** `/imagenes/listar`, `/imagenes/registrar`.
- **Productos:** `/producto/listar`, `/producto/registrar`, `/producto/actualizar/:id`.
- **Procesos y Categorías de Producto:** Diversas rutas de mantenimiento.

## 🔐 Seguridad y AuthGuard

El acceso a las rutas hijas de `/administracion` está protegido por un **AuthGuard** (`src/app/services/auth.guard.ts`). Este guard verifica la existencia y validez de un token JWT almacenado localmente. Si el usuario no está autenticado, es redirigido a `/login`.

## 🚀 Instalación y Ejecución Local

1. Asegúrate de tener **Node.js** (v18 o superior) y **Angular CLI** instalados.
2. Clona el repositorio e ingresa a la carpeta.
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run start
   # o
   ng serve
   ```
5. Accede a la aplicación en tu navegador a través de `http://localhost:4200/`.

> [!NOTE]
> La aplicación se comunica por defecto con el backend configurado en el archivo de entornos (`environment.ts`). En producción, esta API suele apuntar a Koyeb u otro servicio cloud.
