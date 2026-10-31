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

## Postman

`postman/Cars API.postman_collection.json` contains the "Cars API" collection with tests for all endpoints, including a validation error case. Import it into Postman or run it with the Postman CLI while the API is running:

```bash
postman collection run "postman/Cars API.postman_collection.json"
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request to `main` and on every push to `main`:

- **backend** – restores and builds the solution, starts `Cars.API` on `http://localhost:5127` and runs the Postman collection with the Postman CLI. If a step fails, the API log is printed.
