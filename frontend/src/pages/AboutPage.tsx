export default function AboutPage() {
  return (
    <section>
      <h1>O aplikacji</h1>

      <p>
        Cars to aplikacja do zarządzania listą samochodów, przygotowana na
        zajęcia z Aplikacji webowych i sieciowych.
      </p>

      <ul>
        <li>Frontend: React, TypeScript, Vite, React Router, Axios, Zustand.</li>
        <li>Backend: ASP.NET Core Web API, MediatR, FluentValidation, EF Core, SQLite.</li>
        <li>Konta: ASP.NET Core Identity, JWT, potwierdzanie e-mail i reset hasła.</li>
      </ul>

      <p>
        Zalogowany użytkownik może przeglądać, dodawać i edytować samochody
        oraz oznaczać ulubione. Usuwanie samochodów jest dostępne tylko dla
        administratora.
      </p>
    </section>
  );
}
