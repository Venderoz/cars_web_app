# Cars Web App

Web application for managing cars (Web and Network Applications course, 2026/27).

## Backend

`backend/` contains an ASP.NET Core Web API solution (`CarsWebApplication`) using EF Core and SQLite, split into projects inspired by Clean Architecture:

- `Cars.API` – startup project: controllers, DTOs, services (JWT, e-mail), middleware, configuration,
- `Cars.Application` – use cases: MediatR queries, commands and handlers, FluentValidation validators,
- `Cars.Domain` – domain model (`Car`, `AppUser`),
- `Cars.Infrastructure` – EF Core `DataContext` (ASP.NET Core Identity), migrations, seed data (cars, roles, admin).

Requests flow: `CarsController` → MediatR → `ValidationBehavior` → handler → `DataContext` → SQLite.
Validation errors return `400 Bad Request`, unexpected errors return `500 Internal Server Error` (`ApiExceptionMiddleware`).

### Accounts and authorization

User accounts use **ASP.NET Core Identity** (`AppUser`, roles `User` and `Admin`) stored in the same SQLite database. After login the API returns a **JWT**; clients send it in the `Authorization: Bearer <token>` header. All `/api/cars` endpoints require a logged-in user (`[Authorize]`), otherwise the API returns `401 Unauthorized`. A `User` can list, view, create and edit cars; only an `Admin` can delete them (`403 Forbidden` otherwise).

- Registration creates a `User` and sends an e-mail confirmation link to the frontend (`/confirm-email`); login is allowed only after confirming the e-mail.
- Forgot password sends a reset link (`/reset-password`); the response is the same whether the account exists or not.
- On startup the roles and an administrator account are seeded: `admin@cars.local` / `Admin123!` (lab simplification, not for production).
- E-mails are sent with MailKit over SMTP; for development use **Mailtrap Email Sandbox**, which captures messages instead of delivering them.

### Secrets (User Secrets)

The JWT signing key and SMTP credentials are not stored in `appsettings.json`. Set them once with User Secrets (in Visual Studio: right-click `Cars.API` → *Manage User Secrets*, or from the command line):

```bash
cd backend/Cars.API
dotnet user-secrets set "Jwt:Key" "<long random key>"
dotnet user-secrets set "Smtp:Host" "sandbox.smtp.mailtrap.io"
dotnet user-secrets set "Smtp:Port" "2525"
dotnet user-secrets set "Smtp:UserName" "<Mailtrap username>"
dotnet user-secrets set "Smtp:Password" "<Mailtrap password>"
dotnet user-secrets set "Smtp:FromEmail" "noreply@cars.local"
```

Without `Jwt:Key` the API does not start; without SMTP settings registration and forgot password fail when sending the e-mail.

### Running

The launch profiles in `Cars.API/Properties/launchSettings.json`:

| Profile | Addresses | Swagger UI |
|---|---|---|
| `http` (default) | `http://localhost:5127` | `http://localhost:5127/swagger` |
| `https` | `https://localhost:7222` and `http://localhost:5127` | `https://localhost:7222/swagger` |

The frontend uses `https://localhost:7222/api` (see `frontend/.env.development`), so run the backend with the **`https`** profile.

#### HTTPS (recommended)

1. Trust the .NET development certificate once (confirm the system dialog):

   ```bash
   dotnet dev-certs https --trust
   ```

   Check it with `dotnet dev-certs https --check --trust`.

2. Start the API with the `https` profile:

   ```bash
   cd backend
   dotnet run --project Cars.API --launch-profile https
   ```

   In **Visual Studio** select the `https` profile in the drop-down next to the green Start button (with `Cars.API` as the startup project) and press F5. Do not type commands into *Debug properties → Command line arguments*; that field passes arguments to the application, not commands.

3. The console should show both addresses:

   ```
   Now listening on: https://localhost:7222
   Now listening on: http://localhost:5127
   ```

   Open `https://localhost:7222/api/cars` or `https://localhost:7222/swagger` in the browser to check it. If the browser still warns about the certificate, open the address once and accept it, or restart the browser after trusting the certificate.

With the `https` profile, requests to `http://localhost:5127` are redirected to HTTPS (`UseHttpsRedirection`).

#### HTTP only

```bash
cd backend
dotnet run --project Cars.API --launch-profile http
```

The frontend then needs `frontend/.env.development.local` with `VITE_API_URL=http://localhost:5127/api` (restart `npm run dev` after creating it).

#### Troubleshooting

- *Brak odpowiedzi z serwera* in the frontend: the API is not listening on the address from `VITE_API_URL` (for example it was started with the `http` profile) or the certificate is not trusted.
- The API listens on `http://localhost:5000`: it was started without a launch profile; use `--launch-profile https` or select the profile in Visual Studio.
- The API does not start with `Brak Jwt:Key.`: set the User Secrets described above.

The `cars.db` database is created on startup (migrations + seed data with 12 sample cars, roles and the admin account; cars are seeded only when the database is empty).

### Endpoints

| Method | URL | Result |
|---|---|---|
| POST | `/api/account/register` | creates an account and sends a confirmation e-mail (200) or 400 |
| GET | `/api/account/confirm-email?userId=&token=` | confirms the e-mail (200) or 400 |
| POST | `/api/account/login` | returns the user with a JWT and roles (200) or 401 |
| POST | `/api/account/forgot-password` | sends a reset link if the account exists (always 200) |
| POST | `/api/account/reset-password` | sets a new password (200) or 400 |
| GET | `/api/cars` | list of cars (200) |
| GET | `/api/cars/{id}` | car details (200) or 404 |
| POST | `/api/cars` | creates a car (201) or 400 |
| PUT | `/api/cars/{id}` | updates a car (204), 400 or 404 |
| DELETE | `/api/cars/{id}` | deletes a car (204), 403 for non-admins or 404 |

All `/api/cars` endpoints return `401` without a valid JWT. Deleting a car additionally requires the `Admin` role (`[Authorize(Roles = "Admin")]`); a logged-in `User` gets `403 Forbidden`.

## Frontend

`frontend/` contains **Cars Client**, a React + TypeScript application built with Vite. It communicates with `Cars.API` using Axios.

```
frontend/src/
├── api/          Axios instance with base URL, timeout, logging and JWT interceptors (apiClient)
├── components/   reusable components (Navigation, CarCard, CarForm, FavoriteButton, ProtectedRoute)
├── layouts/      shared layout with the menu and <Outlet /> (RootLayout)
├── models/       TypeScript types and labels (Car, NewCar, fuel and body types; User, LoginData, RegisterData)
├── pages/        views rendered by the router
├── services/     HTTP communication with Cars.API (carService, authService)
├── store/        Zustand stores (useCarUiStore for UI state, useAuthStore for the logged-in user)
├── App.tsx       route configuration
└── main.tsx      entry point, BrowserRouter
```

Libraries: React Router (`react-router`) for navigation, Axios for HTTP requests, Zustand for shared UI state.

Styling is plain CSS in `src/index.css`: design tokens (colors, radii, shadows) as CSS variables, an automatic dark theme based on the system setting (`prefers-color-scheme`), a sticky navigation bar, cars shown as a responsive card grid and a layout that adapts to phone screens.

### Accounts in the frontend

- `useAuthStore` keeps the logged-in user (id, name, e-mail, JWT, roles) and is persisted in `localStorage` under `cars-auth-store`, so the user stays logged in after a refresh.
- A request interceptor in `apiClient` adds `Authorization: Bearer <token>` to every request when a user is logged in.
- A response interceptor logs the user out when the API returns `401 Unauthorized` (for example an expired or invalid JWT); `ProtectedRoute` then redirects to `/login`.
- `ProtectedRoute` guards all `/cars` routes and redirects to `/login` when nobody is logged in.
- The menu shows *Logowanie* / *Rejestracja* for guests and the cars links, favorites counter, user name with roles and *Wyloguj* for logged-in users.
- The delete button is shown only to users with the `Admin` role. This only adjusts the UI; the backend enforces the permission.
- `/confirm-email` and `/reset-password` are the pages opened from the e-mail links sent by the backend.

### UI state (Zustand)

`useCarUiStore` keeps state shared by several components: the search text, the "favorites only" filter and the favorite car ids of each user (`favoriteCarIdsByUser`, keyed by user id). Server data (cars, car details) stays in component state loaded through `carService`.

- Cars can be marked as favorites with a star button (`FavoriteButton`) on the list and on the details page; the menu shows the number of favorites of the logged-in user.
- Every user has an independent list of favorites; after switching accounts the stars and the counter show the favorites of the current user.
- Deleting a car also removes its id from the current user's favorites.
- The cars list has a search box (brand or model) and a "Tylko ulubione" (favorites only) checkbox; both filter the loaded list on the client and can be combined.
- Only `favoriteCarIdsByUser` is persisted in `localStorage` under the `cars-ui-store` key (store version 1; data saved in the old single-list format is replaced with an empty object), so favorites survive a page refresh and logging out. The search text and the favorites-only filter are kept while navigating in the app and reset after a refresh.

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
| `/about` | about the application |
| `/login` | login form |
| `/register` | registration form |
| `/confirm-email` | e-mail confirmation (link from the e-mail) |
| `/forgot-password` | request a password reset link |
| `/reset-password` | set a new password (link from the e-mail) |
| `/cars` | list of cars with search by brand or model and a favorites-only filter |
| `/cars/new` | create car form |
| `/cars/:id` | car details |
| `/cars/:id/edit` | edit car form |
| `*` | not found page |

All `/cars` routes require a logged-in user.

## Postman

`postman/Cars API.postman_collection.json` contains the "Cars API" collection with three folders:

- **Account** – request without a token (401), wrong password (401), admin login (saves the JWT in `adminToken`) and forgot password with an unknown e-mail,
- **Cars** – CRUD requests authorized with `adminToken`, including a validation error case,
- **Account - Email (manual)** – registration, e-mail confirmation, user login, delete as `User` (403) and password reset; needs SMTP and the `userId`, `confirmToken` and `resetToken` variables copied from the e-mails in Mailtrap.

Import it into Postman or run the automated folders with the Postman CLI while the API is running:

```bash
postman collection run "postman/Cars API.postman_collection.json" -i Account -i Cars
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request to `main` and on every push to `main`:

- **backend** – restores and builds the solution, starts `Cars.API` on `http://localhost:5127` with a random JWT key generated for the run, and runs the `Account` and `Cars` folders of the Postman collection with the Postman CLI. If a step fails, the API log is printed.
- **frontend** – installs dependencies with `npm ci`, runs the linter (`oxlint`) and builds the app (TypeScript type check + Vite build).
