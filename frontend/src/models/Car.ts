export interface Car {
  id: string;
  brand: string;
  model: string;
  doorsNumber: number;
  luggageCapacity: number;
  engineCapacity: number;
  fuelType: number;
  productionDate: string;
  averageFuelConsumption: number;
  bodyType: number;
}

export type NewCar = Omit<Car, 'id'>;

export const fuelTypeLabels = [
  'Benzyna',
  'Diesel',
  'Hybryda',
  'Elektryczny',
  'LPG'
];

export const bodyTypeLabels = [
  'Hatchback',
  'Sedan',
  'Kombi',
  'SUV',
  'Roadster'
];
