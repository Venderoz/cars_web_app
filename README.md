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

The API listens on `http://localhost:5127` (profile `http`) or `https://localhost:7222` (profile `https`). The `cars.db` database is created on startup (migrations + seed data with 12 sample cars; seeding runs only when the database is empty).
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

`frontend/` contains **Cars Client**, a React + TypeScript application built with Vite. It communicates with `Cars.API` using Axios.

```
frontend/src/
├── api/          Axios instance with base URL, timeout and logging interceptors (apiClient)
├── components/   reusable components (Navigation, CarCard, CarForm)
├── layouts/      shared layout with the menu and <Outlet /> (RootLayout)
├── models/       TypeScript types and labels (Car, NewCar, fuel and body types)
├── pages/        views rendered by the router
├── services/     HTTP communication with Cars.API (carService)
├── store/        Zustand store for UI state (useCarUiStore)
├── App.tsx       route configuration
└── main.tsx      entry point, BrowserRouter
```

Libraries: React Router (`react-router`) for navigation, Axios for HTTP requests, Zustand for shared UI state.

### UI state (Zustand)

`useCarUiStore` keeps state shared by several components: the search text, the "favorites only" filter and the list of favorite car ids. Server data (cars, car details) stays in component state loaded through `carService`.

- Cars can be marked as favorites on the list (`CarCard`) and on the details page; the menu shows the number of favorites.
- Deleting a car also removes its id from the favorites.
- Only `favoriteCarIds` is persisted in `localStorage` under the `cars-ui-store` key, so favorites survive a page refresh.

### Configuration

The API address is read from `VITE_API_URL` in `frontend/.env.development`:

```
VITE_API_URL=https://localhost:7222/api
```

To use the API over HTTPS, the .NET development certificate has to be trusted once:

```bash
dotnet dev-certs https --trust
```

To use a different address locally (for example `http://localhost:5127/api`), create `frontend/.env.development.local` (ignored by git) with your own `VITE_API_URL`. Restart `npm run dev` after changing env files.

### Running

Start the backend with the `https` profile, then the app:

```bash
cd backend
dotnet run --project Cars.API --launch-profile https
```

```bash
cd frontend
npm install
npm run dev
```

The app is available at `http://localhost:5173`. CORS in `Cars.API` allows requests from this origin.

### Routes

| Path | View |
|---|---|
| `/` | home page |
| `/cars` | list of cars with search by brand or model |
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
