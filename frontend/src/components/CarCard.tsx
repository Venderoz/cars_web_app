import { Link } from 'react-router';
import { bodyTypeLabels, type Car } from '../models/Car';
import FavoriteButton from './FavoriteButton';

interface CarCardProps {
  car: Car;
  isDeleting: boolean;
  onDelete: (car: Car) => void;
}

export default function CarCard({ car, isDeleting, onDelete }: CarCardProps) {
  const productionYear = new Date(car.productionDate).getFullYear();

  return (
    <li className="car-item">
      <div>
        <strong>{car.brand} {car.model}</strong>
        <div className="car-item-meta">
          {productionYear} · {bodyTypeLabels[car.bodyType]}
        </div>
      </div>

      <div className="car-item-actions">
        <FavoriteButton carId={car.id} />
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
