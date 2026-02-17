using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services;

public class RedemptionService
{
    private readonly IMongoCollection<Redemption> _redemptions;

    public RedemptionService(IConfiguration config)
    {
        var connectionString = MongoConfig.GetConnectionString(config);
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new ArgumentException("MongoDB connection string is not configured. Set 'ConnectionStrings__Cars24DB' (recommended) or 'MONGODB_URI'.");

        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(MongoConfig.GetDatabaseName(config));
        _redemptions = database.GetCollection<Redemption>("Redemptions");
    }

    public async Task CreateAsync(Redemption redemption) =>
        await _redemptions.InsertOneAsync(redemption);

    public async Task<List<Redemption>> GetByUserIdAsync(string userId) =>
        await _redemptions.Find(r => r.UserId == userId)
            .SortByDescending(r => r.RedeemedAt)
            .ToListAsync();
}
