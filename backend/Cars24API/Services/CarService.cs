using Cars24API.Models;
using MongoDB.Driver;
using System.Diagnostics;

namespace Cars24API.Services
{
    public class CarService
    {
        private readonly IMongoCollection<Car> _cars;
        private readonly ILogger<CarService> _logger;

        public CarService(MongoDbContext context, ILogger<CarService> logger)
        {
            _cars = context.GetCollection<Car>("Cars");
            _logger = logger;
        }

        public async Task<List<CarListDto>> GetSummariesOptimizedAsync()
        {
            return await GetPagedAsync(1, 12);
        }

        public async Task<List<CarListDto>> GetPagedAsync(int page, int pageSize)
        {
            var stopwatch = Stopwatch.StartNew();

            var result = await _cars
                .Find(_ => true)
                .SortByDescending(c => c.Price)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .Project(car => new CarListDto
                {
                    Id = car.Id ?? string.Empty,
                    Brand = string.IsNullOrWhiteSpace(car.Title) ? string.Empty : car.Title.Split(' ')[0],
                    Model = string.IsNullOrWhiteSpace(car.Title) ? string.Empty : string.Join(" ", car.Title.Split(' ').Skip(1)),
                    Price = car.Price,
                    City = car.Location ?? string.Empty,
                    Year = car.Specs.Year,
                    KmDriven = car.Specs.Km,
                    MainImageUrl = car.Images.FirstOrDefault() ?? string.Empty
                })
                .ToListAsync();

            stopwatch.Stop();

            _logger.LogInformation("GetPagedAsync executed in {ElapsedMs}ms, returned {Count} cars",
                stopwatch.ElapsedMilliseconds, result.Count);

            return result;
        }

        public async Task<Car?> GetByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return null;

            return await _cars.Find(c => c.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Car car)
        {
            await _cars.InsertOneAsync(car);
        }

        public async Task DeleteAsync(string id)
        {
            await _cars.DeleteOneAsync(c => c.Id == id);
        }

        public async Task<long> CountAsync()
        {
            return await _cars.CountDocumentsAsync(_ => true);
        }

        public async Task<int> RemoveDuplicatesAsync()
        {
            var allCars = await _cars.Find(_ => true).ToListAsync();

            var duplicates = allCars
                .GroupBy(c => c.Title)
                .Where(g => g.Count() > 1)
                .SelectMany(g => g.Skip(1))
                .Select(c => c.Id)
                .Where(id => !string.IsNullOrEmpty(id))
                .ToList();

            if (!duplicates.Any())
                return 0;

            var result = await _cars.DeleteManyAsync(c => duplicates.Contains(c.Id));
            return (int)result.DeletedCount;
        }
    }
}