import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import CarListItem from '../components/CarListItem';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      setIsLoading(true);
      setError(null);

      try {
        const loadedCars = await getCars(controller.signal);
        setCars(loadedCars);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCars();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleDelete(car: Car) {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć samochód ${car.brand} ${car.model}?`
    );

    if (!confirmed) return;

    setDeletingId(car.id);
    setDeleteError(null);

    try {
      await deleteCar(car.id);
      setCars((currentCars) => currentCars.filter((item) => item.id !== car.id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Samochody</h1>
        <Link to="/cars/new" className="button">
          Dodaj samochód
        </Link>
      </div>

      {isLoading && <p className="message">Ładowanie samochodów...</p>}

      {error && (
        <p className="message message-error">
          Nie udało się pobrać samochodów. {error}
        </p>
      )}

      {deleteError && (
        <p className="message message-error">
          Nie udało się usunąć samochodu. {deleteError}
        </p>
      )}

      {!isLoading && !error && cars.length === 0 && (
        <p className="message">Brak samochodów na liście.</p>
      )}

      {!isLoading && !error && cars.length > 0 && (
        <ul className="car-list">
          {cars.map((car) => (
            <CarListItem
              key={car.id}
              car={car}
              isDeleting={deletingId === car.id}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
