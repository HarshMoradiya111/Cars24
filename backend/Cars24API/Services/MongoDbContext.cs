using MongoDB.Driver;

namespace Cars24API.Services
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        private readonly MongoClient _client;

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("Cars24DB");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentException("MongoDB connection string 'Cars24DB' is not configured.");
            }

            _client = new MongoClient(connectionString);
            var databaseName = configuration["MongoDB:DatabaseName"] ?? "Cars24DB";
            _database = _client.GetDatabase(databaseName);
        }

        public IMongoDatabase Database => _database;
        public MongoClient Client => _client;

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return _database.GetCollection<T>(collectionName);
        }
    }
}
