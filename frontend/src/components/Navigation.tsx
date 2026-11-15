import {
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

  // Liczba samochodów oznaczonych jako ulubione.
  const favoriteCount =
    useCarUiStore(
      (state) =>
        state.favoriteCarIds.length,
    );

  // Aktualnie zalogowany użytkownik.
  // null oznacza brak zalogowanego użytkownika.
  const user =
    useAuthStore(
      (state) => state.user,
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
      <span className="navigation-brand">Cars Client</span>

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

      {/* Prawa część nawigacji zależy
          od stanu uwierzytelnienia. */}
      {user ? (
        <>
          <span className="favorite-counter">
            Ulubione: {favoriteCount}
          </span>

          <span className="user-info">
            {user.userName}
            {' ('}
            {user.roles.join(', ')}
            {')'}
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
    </nav>
  );
}
