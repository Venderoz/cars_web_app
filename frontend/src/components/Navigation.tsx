import { NavLink } from 'react-router';

export default function Navigation() {
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
    </nav>
  );
}
