# Cars Web App

Web application for managing cars (Web and Network Applications course, 2026/27).

## Backend

`backend/` contains an ASP.NET Core Web API solution (`CarsWebApplication`) using EF Core and SQLite, split into projects inspired by Clean Architecture:

- `Cars.API` – startup project: controllers, middleware, configuration,
- `Cars.Application` – use cases: MediatR queries, commands and handlers, FluentValidation validators,
- `Cars.Domain` – domain model (`Car`),
- `Cars.Infrastructure` – EF Core `DataContext`, migrations, seed data.

Requests flow: `CarsController` → MediatR → `ValidationBehavior` → handler → `DataContext` → SQLite.
Validation errors return `400 Bad Request`, unexpected errors return `500 Internal Server Error` (`ApiExceptionMiddleware`).

### Running

```bash
cd backend
dotnet run --project Cars.API
```

The API listens on `http://localhost:5127`. The `cars.db` database is created on startup (migrations + seed data).
Swagger UI is available at `http://localhost:5127/swagger` in the Development environment.

### Endpoints

| Method | URL | Result |
|---|---|---|
| GET | `/api/cars` | list of cars (200) |
| GET | `/api/cars/{id}` | car details (200) or 404 |
| POST | `/api/cars` | creates a car (201) or 400 |
| PUT | `/api/cars/{id}` | updates a car (204), 400 or 404 |
| DELETE | `/api/cars/{id}` | deletes a car (204) or 404 |

## Frontend

`frontend/` contains **Cars Client**, a React + TypeScript application built with Vite. For now it uses a local REST API served by `json-server` from `frontend/db.json`; it will be switched to `Cars.API` in a later lab.

```
frontend/src/
├── components/   reusable components (Navigation, CarListItem)
├── layouts/      shared layout with the menu and <Outlet /> (RootLayout)
├── models/       TypeScript types and labels (Car, NewCar, fuel and body types)
├── pages/        views rendered by the router
├── services/     HTTP communication with fetch (carService)
├── App.tsx       route configuration
└── main.tsx      entry point, BrowserRouter
```

Libraries: React Router (`react-router`) for navigation, `json-server` as a development-only REST API. No Axios or global state store yet.

### Running

Run the data server and the app in two terminals:

```bash
cd frontend
npm install
npm run api
```

```bash
cd frontend
npm run dev
```

The app is available at `http://localhost:5173`, the data server at `http://localhost:3000/cars`. `json-server` saves changes made in the app to `db.json`.

### Routes

| Path | View |
|---|---|
| `/` | home page |
| `/cars` | list of cars |
| `/cars/new` | create car form |
| `/cars/:id` | car details |
| `/cars/:id/edit` | edit car form |
| `*` | not found page |

## Postman

`postman/Cars API.postman_collection.json` contains the "Cars API" collection with tests for all endpoints, including a validation error case. Import it into Postman or run it with the Postman CLI while the API is running:

```bash
postman collection run "postman/Cars API.postman_collection.json"
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request to `main` and on every push to `main`:

- **backend** – restores and builds the solution, starts `Cars.API` on `http://localhost:5127` and runs the Postman collection with the Postman CLI. If a step fails, the API log is printed.
- **frontend** – installs dependencies with `npm ci`, runs the linter (`oxlint`) and builds the app (TypeScript type check + Vite build).
