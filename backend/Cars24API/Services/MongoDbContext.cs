using MongoDB.Driver;

namespace Cars24API.Services
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        private readonly MongoClient _client;

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = MongoConfig.GetConnectionString(configuration);
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new ArgumentException("MongoDB connection string is not configured. Set 'ConnectionStrings__Cars24DB' (recommended) or 'MONGODB_URI'.");

            _client = new MongoClient(connectionString);
            var databaseName = MongoConfig.GetDatabaseName(configuration);
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
