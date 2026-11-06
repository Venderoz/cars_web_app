import { Link } from 'react-router';
import { bodyTypeLabels, type Car } from '../models/Car';
import {
  useCarUiStore,
} from '../store/useCarUiStore';

interface CarCardProps {
  car: Car;
  isDeleting: boolean;
  onDelete: (car: Car) => void;
}

export default function CarCard({ car, isDeleting, onDelete }: CarCardProps) {
  const productionYear = new Date(car.productionDate).getFullYear();

  const isFavorite =
    useCarUiStore(
      (state) =>
        state.favoriteCarIds.includes(
          car.id,
        ),
    );

  const toggleFavorite =
    useCarUiStore(
      (state) =>
        state.toggleFavorite,
    );

  return (
    <li className="car-item">
      <div>
        <strong>{car.brand} {car.model}</strong>
        <div className="car-item-meta">
          {productionYear} · {bodyTypeLabels[car.bodyType]}
        </div>
      </div>

      <div className="car-item-actions">
        <button
          type="button"
          className={
            isFavorite
              ? 'favorite-button active-favorite'
              : 'favorite-button'
          }
          aria-pressed={isFavorite}
          onClick={() =>
            toggleFavorite(car.id)
          }
        >
          {isFavorite
            ? '★ Ulubiony'
            : '☆ Do ulubionych'}
        </button>
        <Link to={`/cars/${car.id}`} className="button button-secondary">
          Szczegóły
        </Link>
        <Link to={`/cars/${car.id}/edit`} className="button button-secondary">
          Edytuj
        </Link>
        <button
          type="button"
          className="button-danger"
          disabled={isDeleting}
          onClick={() => onDelete(car)}
        >
          {isDeleting ? 'Usuwanie...' : 'Usuń'}
        </button>
      </div>
    </li>
  );
}
