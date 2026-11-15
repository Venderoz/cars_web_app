import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router';

import {
  confirmEmail,
} from '../services/authService';

import {
  useRedirectCountdown,
  type LoginPageState,
} from '../hooks/useRedirectCountdown';

type ConfirmStatus = 'pending' | 'success' | 'error';

const loginState: LoginPageState = {
  message: 'Adres e-mail został potwierdzony. Możesz się zalogować.',
};

export default function ConfirmEmailPage() {
  const [searchParams] =
    useSearchParams();

  const userId =
    searchParams.get('userId');

  const token =
    searchParams.get('token');

  const [status, setStatus] =
    useState<ConfirmStatus>('pending');

  const [message, setMessage] =
    useState('Potwierdzanie konta...');

  // Po udanym potwierdzeniu automatycznie przechodzimy do logowania.
  const secondsLeft =
    useRedirectCountdown(
      status === 'success',
      loginState,
    );

  useEffect(() => {
    if (!userId || !token) {
      return;
    }

    // StrictMode uruchamia efekt dwa razy; wynik
    // pierwszego (anulowanego) wywołania ignorujemy.
    let ignore = false;

    async function confirm() {
      try {
        const result =
          await confirmEmail(
            userId!,
            token!,
          );

        if (!ignore) {
          setMessage(result);
          setStatus('success');
        }
      }
      catch {
        if (!ignore) {
          setMessage(
            'Nie udało się potwierdzić konta. Link mógł wygasnąć lub został już użyty.',
          );
          setStatus('error');
        }
      }
    }

    confirm();

    return () => {
      ignore = true;
    };
  }, [userId, token]);

  if (!userId || !token) {
    return (
      <section className="auth-page">
        <h1>Nieprawidłowy link</h1>
        <p>Link potwierdzający jest niekompletny.</p>
        <Link to="/login" className="back-link">
          <span className="back-link-arrow" aria-hidden="true">←</span>
          Przejdź do logowania
        </Link>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <h1>Potwierdzenie konta</h1>

      <p
        className={
          status === 'error'
            ? 'error-message'
            : 'message'
        }
      >
        {message}
      </p>

      {status === 'success' && (
        <p>
          Za {secondsLeft} s przejdziesz do logowania.
        </p>
      )}

      <Link to="/login" className="back-link">
        <span className="back-link-arrow" aria-hidden="true">←</span>
        Przejdź do logowania
      </Link>
    </section>
  );
}
