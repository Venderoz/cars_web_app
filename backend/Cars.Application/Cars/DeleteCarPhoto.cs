using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class DeleteCarPhoto
{
    public class Command : IRequest<string?>
    {
        public Guid CarId { get; set; }

        public Guid PhotoId { get; set; }
    }

    public class Handler : IRequestHandler<Command, string?>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<string?> Handle(Command request, CancellationToken cancellationToken)
        {
            var photo =
                await _context.CarPhotos.FirstOrDefaultAsync(
                        p =>
                            p.Id == request.PhotoId
                            &&
                            p.CarId == request.CarId,
                        cancellationToken);

            if (photo is null)
            {
                return null;
            }

            var fileName = photo.FileName;

            _context.CarPhotos.Remove(photo);

            // Jeżeli usuwamy zdjęcie główne, głównym zostaje
            // najstarsze z pozostałych zdjęć samochodu.
            if (photo.IsMain)
            {
                var nextMain = await _context.CarPhotos
                    .Where(p => p.CarId == request.CarId && p.Id != photo.Id)
                    .OrderBy(p => p.CreatedAtUtc)
                    .FirstOrDefaultAsync(cancellationToken);

                if (nextMain is not null)
                {
                    nextMain.IsMain = true;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            return fileName;
        }
    }
}
