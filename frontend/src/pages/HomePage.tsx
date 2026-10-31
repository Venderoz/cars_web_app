import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section>
      <h1>Cars Client</h1>
      <p>
        Aplikacja do przeglądania i zarządzania listą samochodów.
        Możesz przeglądać samochody, sprawdzać ich szczegóły, dodawać nowe,
        edytować i usuwać istniejące.
      </p>
      <Link to="/cars" className="button">
        Przejdź do listy samochodów
      </Link>
    </section>
  );
}
