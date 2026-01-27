using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services;

public class RedemptionService
{
    private readonly IMongoCollection<Redemption> _redemptions;

    public RedemptionService(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("Cars24DB"));
        var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        _redemptions = database.GetCollection<Redemption>("Redemptions");
    }

    public async Task CreateAsync(Redemption redemption) =>
        await _redemptions.InsertOneAsync(redemption);

    public async Task<List<Redemption>> GetByUserIdAsync(string userId) =>
        await _redemptions.Find(r => r.UserId == userId)
            .SortByDescending(r => r.RedeemedAt)
            .ToListAsync();
}
