import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router';

import {
  useCarUiStore,
} from '../store/useCarUiStore';

import {
  useAuthStore,
} from '../store/useAuthStore';

export default function Navigation() {
  const navigate = useNavigate();

  // Aktualnie zalogowany użytkownik.
  // null oznacza brak zalogowanego użytkownika.
  const user =
    useAuthStore(
      (state) => state.user,
    );

  // Liczba ulubionych samochodów aktualnego użytkownika.
  const favoriteCount =
    useCarUiStore(
      (state) =>
        user
          ? (
              state.favoriteCarIdsByUser[
                user.id
              ] ?? []
            ).length
          : 0,
    );

  // Akcja wylogowania z magazynu Zustand.
  const logout =
    useAuthStore(
      (state) => state.logout,
    );

  function handleLogout() {
    // Usuwamy użytkownika ze stanu aplikacji.
    logout();

    // Po wylogowaniu przechodzimy
    // na stronę logowania.
    navigate('/login');
  }

  return (
    <nav className="navigation">
      <Link to="/" className="navigation-brand">
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 17h14M3 17v-4l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5v4" />
          <circle cx="7.5" cy="17" r="2" />
          <circle cx="16.5" cy="17" r="2" />
        </svg>
        Cars Client
      </Link>

      <div className="navigation-links">
        {/* Dostępne dla każdego użytkownika. */}
        <NavLink to="/" end>
          Strona główna
        </NavLink>

        {/* Elementy dostępne po zalogowaniu. */}
        {user && (
          <>
            <NavLink to="/cars" end>
              Samochody
            </NavLink>

            <NavLink to="/cars/new">
              Dodaj samochód
            </NavLink>
          </>
        )}

        {/* Dostępne dla każdego użytkownika. */}
        <NavLink to="/about">
          O aplikacji
        </NavLink>
      </div>

      {/* Prawa część nawigacji zależy
          od stanu uwierzytelnienia. */}
      <div className="navigation-user">
        {user ? (
          <>
            <span
              className="favorite-counter"
              title={`Ulubione: ${favoriteCount}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z" />
              </svg>
              <span className="visually-hidden">Ulubione: </span>
              {favoriteCount}
            </span>

            <span className="user-info">
              <span className="user-avatar" aria-hidden="true">
                {user.userName.charAt(0)}
              </span>
              {user.userName}
              {user.roles.map((role) => (
                <span key={role} className="user-role">
                  {role}
                </span>
              ))}
            </span>

            <button
              type="button"
              className="nav-button"
              onClick={handleLogout}
            >
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">
              Logowanie
            </NavLink>

            <NavLink to="/register">
              Rejestracja
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
