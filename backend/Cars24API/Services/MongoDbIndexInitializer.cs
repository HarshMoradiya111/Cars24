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

                // Create indexes for optimized queries
                var indexKeysDefinitions = new[]
                {
                    // Single field indexes for common filters
                    Builders<Car>.IndexKeys.Ascending(c => c.Location),  // City filter
                    Builders<Car>.IndexKeys.Ascending(c => c.Price),      // Price filter
                    Builders<Car>.IndexKeys.Ascending(c => c.Title),      // Search by brand
                    Builders<Car>.IndexKeys.Descending("_id")             // CreatedAt (ObjectId contains timestamp)
                };

                var indexModels = indexKeysDefinitions.Select(key => 
                    new CreateIndexModel<Car>(key, new CreateIndexOptions { Background = true })
                ).ToList();

                // Create compound indexes for efficient multi-field queries
                var compoundIndexes = new[]
                {
                    Builders<Car>.IndexKeys
                        .Ascending(c => c.Location)
                        .Ascending(c => c.Price),
                    Builders<Car>.IndexKeys
                        .Ascending(c => c.Location)
                        .Descending("_id")                          // City + newest first
                };

                foreach (var compoundIndex in compoundIndexes)
                {
                    indexModels.Add(new CreateIndexModel<Car>(compoundIndex, new CreateIndexOptions { Background = true }));
                }

                await carsCollection.Indexes.CreateManyAsync(indexModels);

                _logger.LogInformation("MongoDB indexes created successfully for Cars collection: Location, Price, Title, _id (CreatedAt), and compound indexes");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create MongoDB indexes");
                // Don't throw - indexes are performance optimization, not critical for startup
            }
        }
    }
}
