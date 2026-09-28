# Mongoose API — Tasks & Users

API REST construida con **Node.js**, **Express** y **Mongoose**, siguiendo una arquitectura por capas: `routes → controllers → services (dao) → models`.

## Estructura del proyecto

```
mongoose_api/
├── .env
├── package.json
└── src/
    ├── app.js                  # Punto de entrada
    ├── conf/
    │   └── db.js                # Conexión a MongoDB
    ├── models/
    │   ├── task.js               # Esquema de Task
    │   └── user.js               # Esquema de User
    ├── services/                 # Capa dao: única que habla con Mongoose
    │   ├── taskService.js
    │   └── userService.js
    ├── controllers/              # Maneja req/res, delega en services
    │   ├── handleError.js         # Traduce errores de Mongoose a HTTP
    │   ├── taskController.js
    │   └── userController.js
    └── routes/
        ├── index.js               # Une todas las rutas bajo el prefijo
        ├── taskRoutes.js
        └── userRoutes.js
```

**Flujo de una petición:** `route` define la URL → `controller` recibe `req`/`res` → `service` ejecuta la consulta contra Mongoose → `model` valida y da forma al documento.

## Requisitos

- Node.js 18+
- Un servidor de MongoDB accesible (local, Docker o Atlas)

## Instalación

```bash
npm install
```

## Configuración

Variables de entorno en `.env`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/TasksDB
PORT=3000
API_PREFIX=/api/v1
```

- `MONGODB_URI`: cadena de conexión completa, incluyendo el nombre de la base (`TasksDB`).
- `PORT`: puerto donde escucha el servidor Express.
- `API_PREFIX`: prefijo bajo el que se montan todas las rutas.

## Ejecución

```bash
npm run dev     # con nodemon, reinicia automáticamente
npm start        # sin nodemon
```

Salida esperada:

```
MongoDB connected: 127.0.0.1
Example app listening on port 3000!
```

## Modelos

### User

| Campo | Tipo | Reglas |
|---|---|---|
| `name` | String | requerido |
| `email` | String | requerido, único, minúsculas |
| `createdAt` / `updatedAt` | Date | automáticos (`timestamps`) |

### Task

| Campo | Tipo | Reglas |
|---|---|---|
| `title` | String | requerido, 3–120 caracteres |
| `priority` | String | `low` \| `medium` \| `high` (default `medium`) |
| `completed` | Boolean | default `false` |
| `dueDate` | Date | opcional, debe ser una fecha futura |
| `owner` | ObjectId → `User` | requerido |
| `createdAt` / `updatedAt` | Date | automáticos (`timestamps`) |

## Endpoints

Todas las rutas van precedidas por `API_PREFIX` (por defecto `/api/v1`).

### Users

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/users` | — | Lista todos los usuarios |
| GET | `/users/:id` | — | Obtiene un usuario por id |
| POST | `/users` | `{ "name", "email" }` | Crea un usuario |
| PUT | `/users/:id` | campos a actualizar | Actualiza un usuario |
| DELETE | `/users/:id` | — | Elimina un usuario |

### Tasks

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/tasks` | — | Lista todas las tareas (con `owner` poblado) |
| GET | `/tasks?owner=<id>&priority=high&completed=false` | — | Lista filtrada (todos los parámetros son opcionales) |
| GET | `/tasks/:id` | — | Obtiene una tarea por id |
| POST | `/tasks` | `{ "title", "owner", "priority", "dueDate" }` | Crea una tarea |
| PUT | `/tasks/:id` | campos a actualizar | Actualiza una tarea |
| DELETE | `/tasks/:id` | — | Elimina una tarea |

## Ejemplos de uso

**Crear un usuario**
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Sam","email":"sam@example.com"}'
```

**Crear una tarea** (usa el `_id` devuelto arriba como `owner`)
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship the API","owner":"<id_user>","priority":"high","dueDate":"2026-12-31"}'
```

**Listar tareas pendientes de un usuario**
```bash
curl "http://localhost:3000/api/v1/tasks?owner=<id_user>&completed=false"
```

## Manejo de errores

`handleError.js` traduce los errores de Mongoose a respuestas HTTP consistentes:

| Código | Causa |
|---|---|
| 400 | Validación del esquema fallida (`required`, `minlength`, `enum`, `dueDate` en el pasado) o id con formato inválido |
| 404 | El recurso solicitado no existe |
| 409 | Valor duplicado en un campo único (por ejemplo, `email` repetido) |
| 500 | Error inesperado del servidor |

## Notas

- Borrar un usuario **no** elimina sus tareas asociadas.
- `index.js` e `index2.js` (scripts originales de ejemplo) no son compatibles con el esquema actual, ya que `owner` es obligatorio en `Task`.