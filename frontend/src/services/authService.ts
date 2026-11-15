import axios from 'axios';

import type {
  LoginData,
  RegisterData,
  User,
} from '../models/Auth';

import {
  apiClient,
} from '../api/apiClient';

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;

    if (typeof data === 'string' && data.length > 0) {
      return data;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data.join(' ');
    }

    if (!error.response) {
      return `${fallback} Brak odpowiedzi z serwera.`;
    }
  }

  return fallback;
}

export async function login(
  data: LoginData,
): Promise<User> {
  try {
    const response =
      await apiClient.post<User>(
        '/account/login',
        data,
      );

    return response.data;
  }
  catch (error) {
    throw new Error(
      getErrorMessage(error, 'Nie udało się zalogować.'),
      { cause: error },
    );
  }
}

export async function register(
  data: RegisterData,
): Promise<string> {
  try {
    const response =
      await apiClient.post<{
        message: string;
      }>(
        '/account/register',
        data,
      );

    return response.data.message;
  }
  catch (error) {
    throw new Error(
      getErrorMessage(error, 'Nie udało się zarejestrować.'),
      { cause: error },
    );
  }
}

export async function confirmEmail(
  userId: string,
  token: string,
): Promise<string> {
  const response =
    await apiClient.get<{
      message: string;
    }>(
      '/account/confirm-email',
      {
        params: {
          userId,
          token,
        },
      },
    );

  return response.data.message;
}

export async function forgotPassword(
  email: string,
): Promise<string> {
  try {
    const response =
      await apiClient.post<{
        message: string;
      }>(
        '/account/forgot-password',
        { email },
      );

    return response.data.message;
  }
  catch (error) {
    throw new Error(
      getErrorMessage(error, 'Nie udało się wysłać wiadomości.'),
      { cause: error },
    );
  }
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string,
): Promise<string> {
  try {
    const response =
      await apiClient.post<{
        message: string;
      }>(
        '/account/reset-password',
        {
          email,
          token,
          newPassword,
        },
      );

    return response.data.message;
  }
  catch (error) {
    throw new Error(
      getErrorMessage(error, 'Nie udało się zmienić hasła.'),
      { cause: error },
    );
  }
}
