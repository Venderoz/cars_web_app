import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import CarCard from '../components/CarCard';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';
import {
  useCarUiStore,
} from '../store/useCarUiStore';
import {
  useAuthStore,
} from '../store/useAuthStore';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // pobranie użytkownika
  const user =
    useAuthStore(
      (state) => state.user,
    );

  const searchTerm =
    useCarUiStore(
      (state) =>
        state.searchTerm,
    );

  const setSearchTerm =
    useCarUiStore(
      (state) =>
        state.setSearchTerm,
    );

  const showFavoritesOnly =
    useCarUiStore(
      (state) =>
        state.showFavoritesOnly,
    );

  const setShowFavoritesOnly =
    useCarUiStore(
      (state) =>
        state.setShowFavoritesOnly,
    );

  const favoriteCarIdsByUser =
    useCarUiStore(
      (state) =>
        state.favoriteCarIdsByUser,
    );

  const favoriteCarIds =
    user
      ? favoriteCarIdsByUser[user.id] ?? []
      : [];

  const removeCarFromFavorites =
    useCarUiStore(
      (state) =>
        state.removeCarFromFavorites,
    );

  const syncFavorites =
    useCarUiStore(
      (state) =>
        state.syncFavorites,
    );

  const userId = user?.id;

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase();

  const visibleCars =
    cars.filter((car) => {
      const matchesSearch =
        car.brand
          .toLowerCase()
          .includes(normalizedSearch)
        ||
        car.model
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFavorite =
        !showFavoritesOnly
        ||
        favoriteCarIds.includes(
          car.id,
        );

      return (
        matchesSearch
        &&
        matchesFavorite
      );
    });

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      setIsLoading(true);
      setError(null);

      try {
        const loadedCars = await getCars(controller.signal);
        setCars(loadedCars);

        // Auta usunięte w międzyczasie (np. przez administratora)
        // znikają z ulubionych zalogowanego użytkownika.
        if (userId) {
          syncFavorites(
            userId,
            loadedCars.map((car) => car.id),
          );
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd.');
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
  }, [userId, syncFavorites]);

  async function handleDelete(car: Car) {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć samochód ${car.brand} ${car.model}?`
    );

    if (!confirmed) return;

    setDeletingId(car.id);
    setDeleteError(null);

    try {
      await deleteCar(car.id);

      // Usunięte auto znika z ulubionych wszystkich użytkowników.
      removeCarFromFavorites(car.id);

      setCars((currentCars) => currentCars.filter((item) => item.id !== car.id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd.');
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
        <p className="message message-error">{error}</p>
      )}

      {deleteError && (
        <p className="message message-error">{deleteError}</p>
      )}

      {!isLoading && !error && cars.length === 0 && (
        <p className="message">Brak samochodów na liście.</p>
      )}

      {!isLoading && !error && cars.length > 0 && (
        <>
          <div className="cars-toolbar">
            <input
              type="search"
              placeholder="Szukaj po marce lub modelu..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
            />

            <label className="favorite-filter">
              <input
                type="checkbox"
                checked={
                  showFavoritesOnly
                }
                onChange={(event) =>
                  setShowFavoritesOnly(
                    event.target.checked,
                  )
                }
              />

              Tylko ulubione
            </label>
          </div>

          {visibleCars.length === 0 && (
            <p className="message">
              Brak samochodów spełniających kryteria wyszukiwania.
            </p>
          )}

          <ul className="car-list">
            {visibleCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                isDeleting={deletingId === car.id}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
