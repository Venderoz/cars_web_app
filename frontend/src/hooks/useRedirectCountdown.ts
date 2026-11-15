import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router';

export interface LoginPageState {
  message?: string;
  email?: string;
}

// Po aktywacji (active = true) odlicza sekundy i przenosi
// na stronę logowania z komunikatem w stanie nawigacji.
export function useRedirectCountdown(
  active: boolean,
  state: LoginPageState,
  seconds = 3,
): number {
  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] =
    useState(seconds);

  useEffect(() => {
    if (!active) {
      return;
    }

    if (secondsLeft <= 0) {
      navigate('/login', {
        replace: true,
        state,
      });
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [active, secondsLeft, navigate, state]);

  return secondsLeft;
}
