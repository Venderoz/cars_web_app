import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { bodyTypeLabels, fuelTypeLabels, type NewCar } from '../models/Car';

interface CarFormProps {
  initialCar: NewCar;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (car: NewCar) => void;
}

type CarFormValues = Record<keyof NewCar, string>;

function toFormValues(car: NewCar): CarFormValues {
  return {
    brand: car.brand,
    model: car.model,
    doorsNumber: String(car.doorsNumber),
    luggageCapacity: String(car.luggageCapacity),
    engineCapacity: String(car.engineCapacity),
    fuelType: String(car.fuelType),
    productionDate: car.productionDate.slice(0, 10),
    averageFuelConsumption: String(car.averageFuelConsumption),
    bodyType: String(car.bodyType)
  };
}

function toNewCar(values: CarFormValues): NewCar {
  return {
    brand: values.brand.trim(),
    model: values.model.trim(),
    doorsNumber: Number(values.doorsNumber),
    luggageCapacity: Number(values.luggageCapacity),
    engineCapacity: Number(values.engineCapacity),
    fuelType: Number(values.fuelType),
    productionDate: values.productionDate,
    averageFuelConsumption: Number(values.averageFuelConsumption),
    bodyType: Number(values.bodyType)
  };
}

function getToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function CarForm({ initialCar, submitLabel, isSubmitting, onSubmit }: CarFormProps) {
  const [formData, setFormData] = useState<CarFormValues>(() => toFormValues(initialCar));
  const [today] = useState(getToday);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(toNewCar(formData));
  }

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <label>
        Marka
        <input name="brand" value={formData.brand} onChange={handleChange} required maxLength={50} />
      </label>

      <label>
        Model
        <input name="model" value={formData.model} onChange={handleChange} required maxLength={50} />
      </label>

      <label>
        Liczba drzwi
        <input
          type="number"
          name="doorsNumber"
          value={formData.doorsNumber}
          onChange={handleChange}
          required
          min={2}
          max={5}
        />
      </label>

      <label>
        Pojemność bagażnika (l)
        <input
          type="number"
          name="luggageCapacity"
          value={formData.luggageCapacity}
          onChange={handleChange}
          required
          min={0}
        />
      </label>

      <label>
        Pojemność silnika (cm³)
        <input
          type="number"
          name="engineCapacity"
          value={formData.engineCapacity}
          onChange={handleChange}
          required
          min={1}
        />
      </label>

      <label>
        Rodzaj paliwa
        <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
          {fuelTypeLabels.map((label, index) => (
            <option key={label} value={index}>{label}</option>
          ))}
        </select>
      </label>

      <label>
        Data produkcji
        <input
          type="date"
          name="productionDate"
          value={formData.productionDate}
          onChange={handleChange}
          required
          max={today}
        />
      </label>

      <label>
        Średnie spalanie (l/100 km)
        <input
          type="number"
          name="averageFuelConsumption"
          value={formData.averageFuelConsumption}
          onChange={handleChange}
          required
          min={0.1}
          step={0.1}
        />
      </label>

      <label>
        Typ nadwozia
        <select name="bodyType" value={formData.bodyType} onChange={handleChange}>
          {bodyTypeLabels.map((label, index) => (
            <option key={label} value={index}>{label}</option>
          ))}
        </select>
      </label>

      <div className="car-form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
