using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("Cars24DB"));

        var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        _users = database.GetCollection<User>("Users");
    }

    public async Task<User?> GetByEmailAsync(string email) =>
        await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

    public async Task<User?> GetByReferralCodeAsync(string referralCode) =>
        await _users.Find(u => u.ReferralCode == referralCode).FirstOrDefaultAsync();

    public async Task CreateAsync(User user) =>
        await _users.InsertOneAsync(user);

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
    }
    public async Task UpdateAsync(string id, User user)
    {
        await _users.ReplaceOneAsync(u => u.Id == id, user);
    }

    public async Task AddWalletPointsAsync(string userId, int points)
    {
        var update = Builders<User>.Update.Inc(u => u.WalletPoints, points);
        await _users.UpdateOneAsync(u => u.Id == userId, update);
    }

    public async Task<bool> RedeemAsync(string userId, int cost)
    {
        var filter = Builders<User>.Filter.And(
            Builders<User>.Filter.Eq(u => u.Id, userId),
            Builders<User>.Filter.Gte(u => u.WalletPoints, cost)
        );

        var update = Builders<User>.Update.Inc(u => u.WalletPoints, -cost);

        var result = await _users.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<string> GenerateUniqueReferralCodeAsync()
    {
        // Keep it short but unique enough for this app
        string code;
        do
        {
            code = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpperInvariant();
        } while (await GetByReferralCodeAsync(code) != null);

        return code;
    }

}
