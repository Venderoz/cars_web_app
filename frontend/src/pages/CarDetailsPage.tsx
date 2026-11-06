import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { bodyTypeLabels, fuelTypeLabels, type Car } from '../models/Car';
import { getCarById } from '../services/carService';
import {
  useCarUiStore,
} from '../store/useCarUiStore';

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favoriteCarIds =
    useCarUiStore(
      (state) =>
        state.favoriteCarIds,
    );

  const toggleFavorite =
    useCarUiStore(
      (state) =>
        state.toggleFavorite,
    );

  const isFavorite =
    car !== null &&
    favoriteCarIds.includes(
      car.id,
    );

  useEffect(() => {
    if (!id) return;

    const carId = id;
    const controller = new AbortController();

    async function loadCar() {
      setIsLoading(true);
      setError(null);

      try {
        const loadedCar = await getCarById(carId, controller.signal);
        setCar(loadedCar);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCar();

    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <section>
      <Link to="/cars">← Wróć do listy</Link>

      {isLoading && <p className="message">Ładowanie samochodu...</p>}

      {error && (
        <p className="message message-error">{error}</p>
      )}

      {!isLoading && !error && car && (
        <>
          <div className="page-header">
            <h1>{car.brand} {car.model}</h1>
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
              <Link to={`/cars/${car.id}/edit`} className="button">
                Edytuj
              </Link>
            </div>
          </div>

          <dl className="details">
            <dt>Marka</dt>
            <dd>{car.brand}</dd>

            <dt>Model</dt>
            <dd>{car.model}</dd>

            <dt>Liczba drzwi</dt>
            <dd>{car.doorsNumber}</dd>

            <dt>Pojemność bagażnika</dt>
            <dd>{car.luggageCapacity} l</dd>

            <dt>Pojemność silnika</dt>
            <dd>{car.engineCapacity} cm³</dd>

            <dt>Rodzaj paliwa</dt>
            <dd>{fuelTypeLabels[car.fuelType]}</dd>

            <dt>Data produkcji</dt>
            <dd>{new Date(car.productionDate).toLocaleDateString('pl-PL')}</dd>

            <dt>Średnie spalanie</dt>
            <dd>{car.averageFuelConsumption} l/100 km</dd>

            <dt>Typ nadwozia</dt>
            <dd>{bodyTypeLabels[car.bodyType]}</dd>
          </dl>
        </>
      )}
    </section>
  );
}
