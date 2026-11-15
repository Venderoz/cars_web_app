import {
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router';

import {
  resetPassword,
} from '../services/authService';

import {
  useRedirectCountdown,
  type LoginPageState,
} from '../hooks/useRedirectCountdown';

export default function ResetPasswordPage() {
  const [searchParams] =
    useSearchParams();

  const email =
    searchParams.get('email');

  const token =
    searchParams.get('token');

  const [newPassword, setNewPassword] =
    useState('');

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // Po zmianie hasła przechodzimy do logowania z wpisanym e-mailem.
  const loginState = useMemo<LoginPageState>(() => ({
    message: 'Hasło zostało zmienione. Zaloguj się nowym hasłem.',
    email: email ?? undefined,
  }), [email]);

  const secondsLeft =
    useRedirectCountdown(
      message !== null,
      loginState,
    );

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setNewPassword(event.target.value);
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email || !token) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result =
        await resetPassword(
          email,
          token,
          newPassword,
        );

      setMessage(result);
    }
    catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      }
      else {
        setError(
          'Nie udało się zmienić hasła.',
        );
      }
    }
    finally {
      setIsSubmitting(false);
    }
  }

  if (!email || !token) {
    return (
      <section className="auth-page">
        <h1>Nieprawidłowy link</h1>
        <p>Link do zmiany hasła jest niekompletny.</p>
        <Link to="/login" className="back-link">
          <span className="back-link-arrow" aria-hidden="true">←</span>
          Wróć do logowania
        </Link>
      </section>
    );
  }

  if (message) {
    return (
      <section className="auth-page">
        <h1>Hasło zmienione</h1>

        <p className="message">
          {message}
        </p>

        <p>
          Za {secondsLeft} s przejdziesz do logowania.
        </p>

        <Link
          to="/login"
          state={loginState}
          className="back-link"
        >
          <span className="back-link-arrow" aria-hidden="true">←</span>
          Przejdź do logowania
        </Link>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <h1>Ustaw nowe hasło</h1>

      <p>
        Konto: <strong>{email}</strong>
      </p>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <form
        className="car-form"
        onSubmit={handleSubmit}
      >
        <label>
          Nowe hasło
          <input
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <small className="form-hint">
            Min. 8 znaków, mała i wielka litera oraz cyfra.
          </small>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Zapisywanie...'
            : 'Zmień hasło'}
        </button>
      </form>
    </section>
  );
}
