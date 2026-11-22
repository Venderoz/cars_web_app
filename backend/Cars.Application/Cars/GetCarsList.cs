using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class GetCarsList
{
    public class Query : IRequest<List<CarDto>>
    {
    }

    public class Handler : IRequestHandler<Query, List<CarDto>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<List<CarDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            return await _context.Cars
                .AsNoTracking()
                .Select(CarMapper.Projection)
                .ToListAsync(cancellationToken);
        }
    }
}
