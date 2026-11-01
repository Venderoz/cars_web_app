import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import CarForm from '../components/CarForm';
import type { Car, NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const carId = id;
    const controller = new AbortController();

    async function loadCar() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const loadedCar = await getCarById(carId, controller.signal);
        setCar(loadedCar);
      } catch (err) {
        if (controller.signal.aborted) return;
        setLoadError(err instanceof Error ? err.message : 'Unknown error');
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

  async function handleSubmit(updatedCar: NewCar) {
    if (!id) return;

    setIsSubmitting(true);
    setSaveError(null);

    try {
      await updateCar(id, updatedCar);
      navigate(`/cars/${id}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Unknown error');
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <Link to={id ? `/cars/${id}` : '/cars'}>← Wróć do szczegółów</Link>
      <h1>Edytuj samochód</h1>

      {isLoading && <p className="message">Ładowanie samochodu...</p>}

      {loadError && (
        <p className="message message-error">
          Nie udało się pobrać samochodu. {loadError}
        </p>
      )}

      {saveError && (
        <p className="message message-error">
          Nie udało się zapisać zmian. {saveError}
        </p>
      )}

      {!isLoading && !loadError && car && (
        <CarForm
          initialCar={car}
          submitLabel="Zapisz zmiany"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
