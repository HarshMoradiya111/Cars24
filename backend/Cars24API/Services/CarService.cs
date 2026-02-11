using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services
{
    public class CarService
    {
        private readonly IMongoCollection<Car> _cars;
        public CarService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));

            var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
            _cars = database.GetCollection<Car>("Cars");
        }
        public async Task<List<Car>> GetAllAsync() =>
            await _cars.Find(_ => true).ToListAsync();
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