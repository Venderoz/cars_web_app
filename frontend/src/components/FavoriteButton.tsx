import {
  useCarUiStore,
} from '../store/useCarUiStore';
import {
  useAuthStore,
} from '../store/useAuthStore';

interface FavoriteButtonProps {
  carId: string;
}

export default function FavoriteButton({ carId }: FavoriteButtonProps) {
  const user =
    useAuthStore(
      (state) => state.user,
    );

  // 1. Zustand zwraca istniejący obiekt ze store.
  const favoriteCarIdsByUser =
    useCarUiStore(
      (state) =>
        state.favoriteCarIdsByUser,
    );

  // 2. Dopiero zwykły kod JS wybiera tablicę użytkownika.
  const favoriteCarIds =
    user
      ? favoriteCarIdsByUser[user.id] ?? []
      : [];

  const isFavorite =
    favoriteCarIds.includes(
      carId,
    );

  const toggleFavorite =
    useCarUiStore(
      (state) =>
        state.toggleFavorite,
    );

  const label = isFavorite
    ? 'Usuń z ulubionych'
    : 'Dodaj do ulubionych';

  return (
    <button
      type="button"
      className={
        isFavorite
          ? 'favorite-button active-favorite'
          : 'favorite-button'
      }
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      onClick={() => {
        if (user) {
          toggleFavorite(user.id, carId);
        }
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
      >
        <path d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z" />
      </svg>
    </button>
  );
}
