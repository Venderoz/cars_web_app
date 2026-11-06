import {
  useCarUiStore,
} from '../store/useCarUiStore';

interface FavoriteButtonProps {
  carId: string;
}

export default function FavoriteButton({ carId }: FavoriteButtonProps) {
  const isFavorite =
    useCarUiStore(
      (state) =>
        state.favoriteCarIds.includes(
          carId,
        ),
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
      onClick={() =>
        toggleFavorite(carId)
      }
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
