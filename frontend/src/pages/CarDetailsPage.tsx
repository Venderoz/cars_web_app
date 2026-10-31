import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { bodyTypeLabels, fuelTypeLabels, type Car } from '../models/Car';
import { getCarById } from '../services/carService';

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
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
        <p className="message message-error">
          Nie udało się pobrać samochodu. {error}
        </p>
      )}

      {!isLoading && !error && car && (
        <>
          <div className="page-header">
            <h1>{car.brand} {car.model}</h1>
            <Link to={`/cars/${car.id}/edit`} className="button">
              Edytuj
            </Link>
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
