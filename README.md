# Cars Web App

Aplikacja webowa do zarządzania samochodami (Aplikacje webowe i sieciowe 2026/27).

## Backend

`backend/` — ASP.NET Core Web API (`CarsWebApplication`) z EF Core i SQLite, podział inspirowany Clean Architecture:

- `Cars.API` — kontrolery, konfiguracja, projekt startowy,
- `Cars.Application` — logika aplikacji,
- `Cars.Domain` — model domenowy,
- `Cars.Infrastructure` — EF Core, `DataContext`, migracje, dane startowe.

### Uruchomienie

```bash
cd backend
dotnet run --project Cars.API
```

Baza `cars.db` tworzy się automatycznie przy starcie (migracje + seed).
