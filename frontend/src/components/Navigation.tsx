import { NavLink } from 'react-router';
import {
  useCarUiStore,
} from '../store/useCarUiStore';

export default function Navigation() {
  const favoriteCount =
    useCarUiStore(
      (state) =>
        state.favoriteCarIds.length,
    );

  return (
    <nav className="navigation">
      <span className="navigation-brand">Cars Client</span>
      <NavLink to="/" end>
        Strona główna
      </NavLink>
      <NavLink to="/cars" end>
        Samochody
      </NavLink>
      <NavLink to="/cars/new">
        Dodaj samochód
      </NavLink>
      <span className="favorite-counter">
        Ulubione: {favoriteCount}
      </span>
    </nav>
  );
}
