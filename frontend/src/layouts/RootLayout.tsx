import { Outlet } from 'react-router';
import Navigation from '../components/Navigation';

export default function RootLayout() {
  return (
    <>
      <Navigation />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        Cars · Aplikacje webowe i sieciowe 2026/27
      </footer>
    </>
  );
}
