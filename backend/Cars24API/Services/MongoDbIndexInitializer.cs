using MongoDB.Driver;
using Cars24API.Models;

namespace Cars24API.Services
{
    public class MongoDbIndexInitializer
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<MongoDbIndexInitializer> _logger;

        public MongoDbIndexInitializer(MongoDbContext context, ILogger<MongoDbIndexInitializer> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task InitializeAsync()
        {
            try
            {
                var carsCollection = _context.GetCollection<Car>("Cars");

                var indexKeysDefinitions = new[]
                {
                    Builders<Car>.IndexKeys.Ascending(c => c.Location),
                    Builders<Car>.IndexKeys.Ascending(c => c.Price),
                    Builders<Car>.IndexKeys.Ascending(c => c.Title)
                };

                var indexModels = new List<CreateIndexModel<Car>>();

                foreach (var key in indexKeysDefinitions)
                {
                    var options = new CreateIndexOptions { Background = true };
                    indexModels.Add(new CreateIndexModel<Car>(key, options));
                }

                var compoundIndexes = new[]
                {
                    Builders<Car>.IndexKeys
                        .Ascending(c => c.Location)
                        .Ascending(c => c.Price),
                    Builders<Car>.IndexKeys
                        .Ascending(c => c.Location)
                        .Descending("_id")
                };

                foreach (var compoundIndex in compoundIndexes)
                {
                    indexModels.Add(new CreateIndexModel<Car>(compoundIndex));
                }

                await carsCollection.Indexes.CreateManyAsync(indexModels);

                _logger.LogInformation("MongoDB indexes created successfully for Cars collection: Location, Price, Title, and compound indexes");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create MongoDB indexes");
            }
        }
    }
}
