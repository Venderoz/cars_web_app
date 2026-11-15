import { Link } from 'react-router';
import {
  useAuthStore,
} from '../store/useAuthStore';

export default function HomePage() {
  const user =
    useAuthStore(
      (state) => state.user,
    );

  return (
    <section>
      <h1>Cars Client</h1>
      <p>
        Aplikacja do przeglądania i zarządzania listą samochodów.
        Możesz przeglądać samochody, sprawdzać ich szczegóły, dodawać nowe,
        edytować i usuwać istniejące.
      </p>

      {user ? (
        <Link to="/cars" className="button">
          Przejdź do listy samochodów
        </Link>
      ) : (
        <p>
          <Link to="/login" className="button">
            Zaloguj się
          </Link>{' '}
          <Link to="/register" className="button button-secondary">
            Załóż konto
          </Link>
        </p>
      )}
    </section>
  );
}
