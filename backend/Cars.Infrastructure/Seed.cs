using Cars.Domain;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure;

public static class Seed
{
    public static async Task SeedData(DataContext context)
    {
        if (await context.Cars.AnyAsync()) return;

        var cars = new List<Car>
        {
            new Car
            {
                Brand = "Toyota",
                Model = "Corolla",
                DoorsNumber = 5,
                LuggageCapacity = 470,
                EngineCapacity = 1798,
                FuelType = FuelType.Hybrid,
                ProductionDate = new DateTime(2022, 5, 10, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 4.7,
                BodyType = BodyType.Sedan
            },
            new Car
            {
                Brand = "Skoda",
                Model = "Octavia",
                DoorsNumber = 5,
                LuggageCapacity = 600,
                EngineCapacity = 1498,
                FuelType = FuelType.Petrol,
                ProductionDate = new DateTime(2021, 3, 15, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 6.0,
                BodyType = BodyType.Kombi
            },
            new Car
            {
                Brand = "Toyota",
                Model = "Yaris",
                DoorsNumber = 5,
                LuggageCapacity = 286,
                EngineCapacity = 1490,
                FuelType = FuelType.Hybrid,
                ProductionDate = new DateTime(2023, 2, 20, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 3.8,
                BodyType = BodyType.Hatchback
            },
            new Car
            {
                Brand = "Skoda",
                Model = "Fabia",
                DoorsNumber = 5,
                LuggageCapacity = 380,
                EngineCapacity = 999,
                FuelType = FuelType.Petrol,
                ProductionDate = new DateTime(2020, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 5.2,
                BodyType = BodyType.Hatchback
            },
            new Car
            {
                Brand = "Volkswagen",
                Model = "Golf",
                DoorsNumber = 5,
                LuggageCapacity = 381,
                EngineCapacity = 1968,
                FuelType = FuelType.Diesel,
                ProductionDate = new DateTime(2019, 11, 12, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 4.9,
                BodyType = BodyType.Hatchback
            },
            new Car
            {
                Brand = "Volkswagen",
                Model = "Passat",
                DoorsNumber = 5,
                LuggageCapacity = 650,
                EngineCapacity = 1968,
                FuelType = FuelType.Diesel,
                ProductionDate = new DateTime(2018, 6, 30, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 5.1,
                BodyType = BodyType.Kombi
            },
            new Car
            {
                Brand = "BMW",
                Model = "320d",
                DoorsNumber = 4,
                LuggageCapacity = 480,
                EngineCapacity = 1995,
                FuelType = FuelType.Diesel,
                ProductionDate = new DateTime(2021, 8, 5, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 4.8,
                BodyType = BodyType.Sedan
            },
            new Car
            {
                Brand = "Mazda",
                Model = "CX-60",
                DoorsNumber = 5,
                LuggageCapacity = 570,
                EngineCapacity = 2488,
                FuelType = FuelType.Hybrid,
                ProductionDate = new DateTime(2024, 4, 1, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 1.5,
                BodyType = BodyType.SUV
            },
            new Car
            {
                Brand = "Mazda",
                Model = "MX-5",
                DoorsNumber = 2,
                LuggageCapacity = 130,
                EngineCapacity = 1998,
                FuelType = FuelType.Petrol,
                ProductionDate = new DateTime(2022, 7, 14, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 6.9,
                BodyType = BodyType.Roadster
            },
            new Car
            {
                Brand = "Dacia",
                Model = "Duster",
                DoorsNumber = 5,
                LuggageCapacity = 445,
                EngineCapacity = 999,
                FuelType = FuelType.LPG,
                ProductionDate = new DateTime(2023, 10, 3, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 7.4,
                BodyType = BodyType.SUV
            },
            new Car
            {
                Brand = "Renault",
                Model = "Clio",
                DoorsNumber = 5,
                LuggageCapacity = 391,
                EngineCapacity = 999,
                FuelType = FuelType.Petrol,
                ProductionDate = new DateTime(2021, 1, 25, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 5.8,
                BodyType = BodyType.Hatchback
            },
            new Car
            {
                Brand = "Kia",
                Model = "Sportage",
                DoorsNumber = 5,
                LuggageCapacity = 591,
                EngineCapacity = 1598,
                FuelType = FuelType.Hybrid,
                ProductionDate = new DateTime(2024, 1, 18, 0, 0, 0, DateTimeKind.Utc),
                AverageFuelConsumption = 5.6,
                BodyType = BodyType.SUV
            }
        };

        await context.Cars.AddRangeAsync(cars);
        await context.SaveChangesAsync();
    }
}
