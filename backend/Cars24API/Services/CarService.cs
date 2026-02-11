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

        public async Task<List<Car>> GetAllAsync() =>
            await _cars.Find(_ => true).ToListAsync();

        public async Task<List<CarListDto>> GetSummariesOptimizedAsync()
        {
            var stopwatch = Stopwatch.StartNew();

            // Use only inclusion projection - include only the fields we need
            var projection = Builders<Car>.Projection
                .Include(c => c.Id)
                .Include(c => c.Title)
                .Include(c => c.Price)
                .Include(c => c.Location)
                .Include(c => c.Specs.Year)
                .Include(c => c.Specs.Km)
                .Include(c => c.Images);

            // Limit to 12 cars for reduced response size
            var cars = await _cars.Find(_ => true)
                .Project<Car>(projection)
                .Limit(12)
                .ToListAsync();

            var result = cars.Select(car => new CarListDto
            {
                Id = car.Id,
                Brand = ExtractBrand(car.Title),
                Model = ExtractModel(car.Title),
                Price = car.Price,
                City = car.Location,
                Year = car.Specs?.Year ?? 0,
                KmDriven = car.Specs?.Km ?? "0",
                MainImageUrl = car.Images?.FirstOrDefault() ?? string.Empty
            }).ToList();

            stopwatch.Stop();
            _logger.LogInformation("GetSummariesOptimizedAsync executed in {ElapsedMs}ms, returned {Count} cars with estimated {SizeKb}KB", 
                stopwatch.ElapsedMilliseconds, result.Count, Math.Max(result.Count * 8, 96));

            return result;
        }

        public async Task<List<CarListDto>> GetAllOptimizedAsync()
        {
            var stopwatch = Stopwatch.StartNew();

            var projection = Builders<Car>.Projection
                .Include(c => c.Id)
                .Include(c => c.Title)
                .Include(c => c.Price)
                .Include(c => c.Emi)
                .Include(c => c.Location)
                .Include(c => c.Specs)
                .Include(c => c.Images)
                .Exclude("Features")
                .Exclude("Highlights");

            var cars = await _cars.Find(_ => true)
                .Project<Car>(projection)
                .ToListAsync();

            var result = cars.Select(car => new CarListDto
            {
                Id = car.Id,
                Brand = ExtractBrand(car.Title),
                Model = ExtractModel(car.Title),
                Price = car.Price,
                City = car.Location,
                Year = car.Specs?.Year ?? 0,
                KmDriven = car.Specs?.Km ?? "0",
                MainImageUrl = car.Images?.FirstOrDefault() ?? string.Empty
            }).ToList();

            stopwatch.Stop();
            _logger.LogInformation("GetAllOptimizedAsync executed in {ElapsedMs}ms, returned {Count} cars", 
                stopwatch.ElapsedMilliseconds, result.Count);

            return result;
        }

        private string ExtractBrand(string title)
        {
            if (string.IsNullOrEmpty(title)) return string.Empty;
            var parts = title.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Length > 0 ? parts[0] : string.Empty;
        }

        private string ExtractModel(string title)
        {
            if (string.IsNullOrEmpty(title)) return string.Empty;
            var parts = title.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Length > 1 ? string.Join(" ", parts.Skip(1)) : string.Empty;
        }
        public async Task<Car?> GetByIdAsync(string id)
        {
            return await _cars.Find(u => u.Id == id).FirstOrDefaultAsync();
        }
        public async Task CreateAsync(Car car) =>
            await _cars.InsertOneAsync(car);
        public async Task DeleteAsync(string id)
        {
            var result = await _cars.DeleteOneAsync(c => c.Id == id);
            if (result.DeletedCount == 0)
            {
                throw new Exception("Car not found");
            }
        }

        public async Task<int> RemoveDuplicatesAsync()
        {
            var allCars = await GetAllAsync();
            var seenTitles = new HashSet<string>();
            var carsToDelete = new List<string>();

            foreach (var car in allCars)
            {
                if (seenTitles.Contains(car.Title))
                {
                    carsToDelete.Add(car.Id);
                }
                else
                {
                    seenTitles.Add(car.Title);
                }
            }

            if (carsToDelete.Count > 0)
            {
                var result = await _cars.DeleteManyAsync(c => carsToDelete.Contains(c.Id));
                return (int)result.DeletedCount;
            }

            return 0;
        }
    }
}