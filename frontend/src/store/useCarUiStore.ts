import {
  create,
} from 'zustand';

import {
  persist,
} from 'zustand/middleware';

interface CarUiStore {
  searchTerm: string;

  showFavoritesOnly: boolean;

  // { id_użytkownika: [id_ulubione_1, id_ulubione_2, ...] }
  favoriteCarIdsByUser:
    Record<string, string[]>;

  setSearchTerm:
    (value: string) => void;

  setShowFavoritesOnly:
    (value: boolean) => void;

  toggleFavorite:
    (
      userId: string,
      carId: string,
    ) => void;

  removeFavorite:
    (
      userId: string,
      carId: string,
    ) => void;

  clearFavorites:
    (userId: string) => void;

  // Usuwa auto z ulubionych wszystkich użytkowników
  // (np. po usunięciu auta z backendu).
  removeCarFromFavorites:
    (carId: string) => void;

  // Zostawia w ulubionych użytkownika tylko auta,
  // które nadal istnieją w backendzie.
  syncFavorites:
    (
      userId: string,
      existingCarIds: string[],
    ) => void;
}

export const useCarUiStore =
  create<CarUiStore>()(
    persist(
      (set) => ({
        searchTerm: '',

        showFavoritesOnly: false,

        // Klucz = id użytkownika.
        // Wartość = lista id jego ulubionych aut.
        favoriteCarIdsByUser: {},

        setSearchTerm: (value) =>
          set({
            searchTerm: value,
          }),

        setShowFavoritesOnly: (value) =>
          set({
            showFavoritesOnly: value,
          }),

        toggleFavorite:
          (
            userId,
            carId,
          ) =>
            set((state) => {
              const current =
                state.favoriteCarIdsByUser[
                  userId
                ] ?? [];

              const updated =
                current.includes(carId)
                  ? current.filter(
                      (id) =>
                        id !== carId,
                    )
                  : [
                      ...current,
                      carId,
                    ];

              return {
                favoriteCarIdsByUser: {
                  ...state.favoriteCarIdsByUser,

                  [userId]:
                    updated,
                },
              };
            }),

        removeFavorite:
          (
            userId,
            carId,
          ) =>
            set((state) => {
              const current =
                state.favoriteCarIdsByUser[
                  userId
                ] ?? [];

              return {
                favoriteCarIdsByUser: {
                  ...state.favoriteCarIdsByUser,

                  [userId]:
                    current.filter(
                      (id) =>
                        id !== carId,
                    ),
                },
              };
            }),

        clearFavorites:
          (userId) =>
            set((state) => ({
              favoriteCarIdsByUser: {
                ...state.favoriteCarIdsByUser,

                [userId]: [],
              },
            })),

        removeCarFromFavorites:
          (carId) =>
            set((state) => ({
              favoriteCarIdsByUser:
                Object.fromEntries(
                  Object.entries(
                    state.favoriteCarIdsByUser,
                  ).map(([userId, ids]) => [
                    userId,
                    ids.filter(
                      (id) =>
                        id !== carId,
                    ),
                  ]),
                ),
            })),

        syncFavorites:
          (
            userId,
            existingCarIds,
          ) =>
            set((state) => {
              const current =
                state.favoriteCarIdsByUser[
                  userId
                ] ?? [];

              const existing =
                current.filter(
                  (id) =>
                    existingCarIds.includes(id),
                );

              // Bez zmian nie tworzymy nowego stanu,
              // żeby nie wywoływać zbędnych renderów.
              if (existing.length === current.length) {
                return state;
              }

              return {
                favoriteCarIdsByUser: {
                  ...state.favoriteCarIdsByUser,

                  [userId]:
                    existing,
                },
              };
            }),
      }),

      {
        name: 'cars-ui-store',

        // Wersja 1 = ulubione per użytkownik. Stary kształt
        // (wspólne favoriteCarIds) zastępujemy pustym obiektem.
        version: 1,

        migrate: () => ({
          favoriteCarIdsByUser: {},
        }),

        partialize: (state) => ({
          favoriteCarIdsByUser:
            state.favoriteCarIdsByUser,
        }),
      },
    ),
  );
