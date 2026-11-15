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
      <div className="hero">
        <h1>
          {user
            ? `Witaj, ${user.userName}!`
            : 'Twoje samochody w jednym miejscu'}
        </h1>
        <p>
          Aplikacja do przeglądania i zarządzania listą samochodów.
          Możesz przeglądać samochody, sprawdzać ich szczegóły, dodawać nowe,
          edytować i usuwać istniejące.
        </p>

        <div className="hero-actions">
          {user ? (
            <>
              <Link to="/cars" className="button">
                Przejdź do listy samochodów
              </Link>
              <Link to="/cars/new" className="button button-secondary">
                Dodaj samochód
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="button">
                Zaloguj się
              </Link>
              <Link to="/register" className="button button-secondary">
                Załóż konto
              </Link>
            </>
          )}
        </div>
      </div>

      <ul className="features">
        <li>
          <strong>Lista i szczegóły</strong>
          <span>Wyszukiwanie po marce i modelu oraz pełne dane każdego auta.</span>
        </li>
        <li>
          <strong>Ulubione</strong>
          <span>Oznaczaj auta gwiazdką; każdy użytkownik ma własną listę.</span>
        </li>
        <li>
          <strong>Konta i role</strong>
          <span>Logowanie z JWT; usuwanie aut tylko dla administratora.</span>
        </li>
      </ul>
    </section>
  );
}
