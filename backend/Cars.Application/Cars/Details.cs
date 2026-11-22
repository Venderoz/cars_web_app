using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class Details
{
    public class Query : IRequest<CarDto?>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, CarDto?>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<CarDto?> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            return await _context.Cars
                .AsNoTracking()
                .Where(car => car.Id == request.Id)
                .Select(CarMapper.Projection)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
