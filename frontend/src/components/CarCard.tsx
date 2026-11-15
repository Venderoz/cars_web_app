import { Link } from 'react-router';
import { bodyTypeLabels, fuelTypeLabels, type Car } from '../models/Car';
import FavoriteButton from './FavoriteButton';
import {
  useAuthStore,
} from '../store/useAuthStore';

interface CarCardProps {
  car: Car;
  isDeleting: boolean;
  onDelete: (car: Car) => void;
}

export default function CarCard({ car, isDeleting, onDelete }: CarCardProps) {
  const productionYear = new Date(car.productionDate).getFullYear();

  const user =
    useAuthStore(
      (state) => state.user,
    );

  // Ukrycie przycisku poprawia interfejs, ale nie jest
  // zabezpieczeniem: uprawnienia sprawdza backend.
  const isAdmin =
    user?.roles.includes('Admin')
    ?? false;

  return (
    <li className="car-item">
      <div className="car-item-header">
        <strong className="car-item-title">{car.brand} {car.model}</strong>
        <FavoriteButton carId={car.id} />
      </div>

      <ul className="car-item-meta">
        <li>{productionYear}</li>
        <li>{bodyTypeLabels[car.bodyType]}</li>
        <li>{fuelTypeLabels[car.fuelType]}</li>
        <li>{car.engineCapacity} cm³</li>
      </ul>

      <div className="car-item-actions">
        <Link to={`/cars/${car.id}`} className="button button-secondary">
          Szczegóły
        </Link>
        <Link to={`/cars/${car.id}/edit`} className="button button-secondary">
          Edytuj
        </Link>
        {isAdmin && (
          <button
            type="button"
            className="button-danger"
            disabled={isDeleting}
            onClick={() => onDelete(car)}
          >
            {isDeleting ? 'Usuwanie...' : 'Usuń'}
          </button>
        )}
      </div>
    </li>
  );
}
