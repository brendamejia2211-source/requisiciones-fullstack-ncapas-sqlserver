# RequiPro — Sistema de Requisiciones Administrativas

Prueba técnica Full-Stack implementada con **React + Node.js/Express + SQL Server**, organizada en una arquitectura de **N capas (Controller / BLL / DAL)** con una **conexión centralizada a la base de datos**.

## Arquitectura

```text
React SPA
   |
   v
Routes + Middleware
   |
   v
Controllers        <- HTTP: request/response
   |
   v
BLL                <- reglas de negocio y validaciones
   |
   v
DAL                <- acceso a datos
   |
   v
config/prisma.js   <- conexión centralizada
   |
   v
SQL Server
```

### Backend
- `controllers/`: recibe peticiones HTTP y delega la operación a la BLL.
- `bll/`: contiene reglas de negocio, validaciones, permisos funcionales y generación de códigos.
- `dal/`: concentra las operaciones de persistencia y consultas.
- `config/prisma.js`: instancia única de Prisma para centralizar la conexión a SQL Server.
- `routes/`: define endpoints y middleware de autenticación/autorización.
- `middleware/`: JWT y control de roles.

## Tecnologías
- Frontend: React 19, Vite, CSS, Lucide React.
- Backend: Node.js 20, Express 5.
- Arquitectura: N capas — Controller / BLL / DAL.
- Base de datos: Microsoft SQL Server 2022.
- ORM: Prisma.
- Autenticación: JWT + bcryptjs.
- Validación: Zod.
- Adjuntos: Multer.
- Contenedores: Docker Compose.

## Ejecución con Docker

Requisitos: Docker Desktop.

```bash
docker compose up --build
```

Abrir:
- Frontend: http://localhost:5173
- API: http://localhost:4000/api/health

El backend crea la base `requisiciones`, genera el cliente Prisma, ejecuta `prisma db push` y carga usuarios/datos demo.

Para detener:

```bash
docker compose down
```

Para eliminar también los datos de SQL Server y comenzar desde cero:

```bash
docker compose down -v
```

## Ejecución manual

1. Tener SQL Server ejecutándose.
2. Copiar `backend/.env.example` a `backend/.env` y ajustar `DATABASE_URL`.
3. En `backend/`:

```bash
npm install
node src/create-db.js
npx prisma generate
npx prisma db push
npm run seed
npm start
```

4. En `frontend/`:

```bash
npm install
npm run dev
```

## Variables de entorno

Ver `backend/.env.example`.

- `DATABASE_URL`: conexión a SQL Server.
- `JWT_SECRET`: clave usada para firmar los JWT.
- `PORT`: puerto de la API.
- `UPLOAD_DIR`: carpeta de archivos adjuntos.

## Credenciales demo

- Empleado: `empleado` / `Empleado123!`
- Administrador: `admin` / `Admin123!`

## API principal

- `POST /api/auth/login`
- `GET /api/requisitions?status=&priority=`
- `POST /api/requisitions`
- `PATCH /api/requisitions/:id/approve`
- `PATCH /api/requisitions/:id/reject`
- `POST /api/requisitions/:id` (adjuntos)
- `GET /api/export/metrics.csv`

## Reglas principales

- El empleado solo visualiza sus propias requisiciones.
- El administrador visualiza todas.
- Solo empleados crean requisiciones.
- Solo administradores aprueban/rechazan.
- El monto debe ser mayor que cero.
- El rechazo requiere comentario obligatorio.
- Las contraseñas se almacenan con hash bcrypt.
- El JWT contiene `id`, `role` y `username`.
