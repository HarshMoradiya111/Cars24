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

            // Fetch documents first without projection
            var documents = await _cars
                .Find(_ => true)
                .SortByDescending(c => c.Price)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            // Map to DTO on client side to avoid MongoDB LINQ translation issues
            var result = documents.Select(c => new CarListDto
            {
                Id = c.Id ?? string.Empty,
                Brand = !string.IsNullOrWhiteSpace(c.Title) ? c.Title.Split(' ')[0] : "",
                Model = !string.IsNullOrWhiteSpace(c.Title) && c.Title.Split(' ').Length > 1 
                    ? string.Join(" ", c.Title.Split(' ').Skip(1)) 
                    : "",
                Price = c.Price,
                City = c.Location,
                Year = c.Specs.Year,
                KmDriven = c.Specs.Km,
                MainImageUrl = c.Images.Count > 0 ? c.Images[0] : ""
            }).ToList();

            stopwatch.Stop();
            _logger.LogInformation("Car list fetched in {Time} ms", stopwatch.ElapsedMilliseconds);

            return result;
        }

        public async Task<Car?> GetByIdAsync(string id)
        {
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
    }
}