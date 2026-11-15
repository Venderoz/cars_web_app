import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="not-found-code">404</p>
      <h1>Nie znaleziono strony</h1>
      <p>Strona o podanym adresie nie istnieje.</p>
      <Link to="/" className="button">
        Wróć na stronę główną
      </Link>
    </section>
  );
}
