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
                    Id = car.Id,
                    Brand = string.IsNullOrEmpty(car.Title) ? string.Empty : car.Title.Split(' ')[0],
                    Model = string.IsNullOrEmpty(car.Title) ? string.Empty :
                            string.Join(" ", car.Title.Split(' ').Skip(1)),
                    Price = car.Price,
                    City = car.Location,
                    Year = car.Specs != null ? car.Specs.Year : 0,
                    KmDriven = car.Specs != null ? car.Specs.Km : "0",
                    MainImageUrl = car.Images != null ? car.Images.FirstOrDefault() : string.Empty
                })
                .ToListAsync();

            stopwatch.Stop();
            _logger.LogInformation("GetPagedAsync executed in {ElapsedMs}ms, returned {Count} cars",
                stopwatch.ElapsedMilliseconds, result.Count);

            return result;
        }

        public async Task<Car?> GetByIdAsync(string id) =>
            await _cars.Find(c => c.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Car car) =>
            await _cars.InsertOneAsync(car);

        public async Task DeleteAsync(string id)
        {
            var result = await _cars.DeleteOneAsync(c => c.Id == id);
            if (result.DeletedCount == 0)
                throw new Exception("Car not found");
        }

        public async Task<long> CountAsync() =>
            await _cars.CountDocumentsAsync(_ => true);
    }
}