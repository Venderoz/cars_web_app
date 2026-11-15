import {
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router';

import type {
  RegisterData,
} from '../models/Auth';

import {
  register,
} from '../services/authService';

const emptyForm: RegisterData = {
  userName: '',
  email: '',
  password: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<RegisterData>(emptyForm);

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const result =
        await register(formData);

      // Po rejestracji od razu przechodzimy do logowania
      // z informacją o mailu aktywacyjnym i wpisanym e-mailem.
      navigate('/login', {
        state: {
          message: result,
          email: formData.email,
        },
      });
    }
    catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      }
      else {
        setError(
          'Nie udało się zarejestrować.',
        );
      }
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <h1>Rejestracja</h1>

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
          Nazwa użytkownika
          <input
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Hasło
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
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
            ? 'Rejestrowanie...'
            : 'Zarejestruj się'}
        </button>
      </form>

      <p>
        Masz już konto?{' '}
        <Link to="/login">
          Zaloguj się
        </Link>
      </p>
    </section>
  );
}
