import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import CarForm from '../components/CarForm';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

const emptyCar: NewCar = {
  brand: '',
  model: '',
  doorsNumber: 5,
  luggageCapacity: 0,
  engineCapacity: 0,
  fuelType: 0,
  productionDate: '',
  averageFuelConsumption: 0,
  bodyType: 0
};

export default function CreateCarPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(car: NewCar) {
    setIsSubmitting(true);
    setError(null);

    try {
      const createdCar = await createCar(car);
      navigate(`/cars/${createdCar.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <Link to="/cars">← Wróć do listy</Link>
      <h1>Dodaj samochód</h1>

      {error && (
        <p className="message message-error">
          Nie udało się dodać samochodu. {error}
        </p>
      )}

      <CarForm
        initialCar={emptyCar}
        submitLabel="Dodaj samochód"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
