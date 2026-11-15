import {
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router';

import {
  login,
  resendConfirmation,
} from '../services/authService';

import type {
  LoginPageState,
} from '../hooks/useRedirectCountdown';

import {
  useAuthStore,
} from '../store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();

  const setUser =
    useAuthStore(
      (state) => state.setUser,
    );

  // Komunikat i e-mail przekazane z rejestracji, potwierdzenia
  // konta albo zmiany hasła.
  const location = useLocation();
  const redirectState =
    location.state as LoginPageState | null;

  const [email, setEmail] =
    useState(redirectState?.email ?? '');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [info, setInfo] =
    useState<string | null>(redirectState?.message ?? null);

  const [isResending, setIsResending] =
    useState(false);

  const emailNotConfirmed =
    error?.includes('potwierdź adres e-mail') ?? false;

  async function handleResend() {
    try {
      setIsResending(true);

      const result =
        await resendConfirmation(email);

      setError(null);
      setInfo(result);
    }
    catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nie udało się wysłać wiadomości.',
      );
    }
    finally {
      setIsResending(false);
    }
  }

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setPassword(event.target.value);
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);
      setInfo(null);

      const user =
        await login({
          email,
          password,
        });

      setUser(user);

      navigate('/cars');
    }
    catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      }
      else {
        setError(
          'Nie udało się zalogować.',
        );
      }
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <h1>Logowanie</h1>

      {info && (
        <p className="message">
          {info}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {emailNotConfirmed && (
        <p>
          Nie dostałeś wiadomości?{' '}
          <button
            type="button"
            className="link-button"
            disabled={isResending || !email}
            onClick={handleResend}
          >
            {isResending
              ? 'Wysyłanie...'
              : 'Wyślij link aktywacyjny ponownie'}
          </button>
        </p>
      )}

      <form
        className="car-form"
        onSubmit={handleSubmit}
      >
        <label>
          E-mail

          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Hasło

          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Logowanie...'
            : 'Zaloguj'}
        </button>
      </form>

      <p>
        <Link to="/forgot-password">
          Nie pamiętasz hasła?
        </Link>
      </p>

      <p>
        Nie masz konta?{' '}
        <Link to="/register">
          Zarejestruj się
        </Link>
      </p>
    </section>
  );
}
