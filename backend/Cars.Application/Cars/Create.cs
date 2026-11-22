using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;

namespace Cars.Application.Cars;

public class Create
{
    public class Command : IRequest<CarDto>
    {
        public required Car Car { get; set; }
    }

    public class Handler : IRequestHandler<Command, CarDto>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<CarDto> Handle(Command request, CancellationToken cancellationToken)
        {
            _context.Cars.Add(request.Car);
            await _context.SaveChangesAsync(cancellationToken);

            return CarMapper.ToDto(request.Car);
        }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Car).SetValidator(new CarValidator());
        }
    }
}
