using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services
{
    public class LoanApplicationService
    {
        private readonly IMongoCollection<LoanApplication> _loanApplications;

        public LoanApplicationService(IConfiguration configuration)
        {
            var connectionString = MongoConfig.GetConnectionString(configuration);
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new ArgumentException("MongoDB connection string is not configured. Set 'ConnectionStrings__Cars24DB' (recommended) or 'MONGODB_URI'.");

            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(MongoConfig.GetDatabaseName(configuration));
            _loanApplications = database.GetCollection<LoanApplication>("LoanApplications");
        }

        public async Task<List<LoanApplication>> GetAllAsync()
        {
            return await _loanApplications.Find(_ => true).ToListAsync();
        }

        public async Task<LoanApplication?> GetByIdAsync(string id)
        {
            if (string.IsNullOrEmpty(id) || id.Length != 24 || !id.All(c => "0123456789abcdefABCDEF".Contains(c)))
            {
                return null;
            }
            return await _loanApplications.Find(l => l.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<LoanApplication>> GetByUserIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId) || userId.Length != 24 || !userId.All(c => "0123456789abcdefABCDEF".Contains(c)))
            {
                return new List<LoanApplication>();
            }
            return await _loanApplications.Find(l => l.UserId == userId).ToListAsync();
        }

        public async Task<LoanApplication> CreateAsync(LoanApplication loanApplication)
        {
            await _loanApplications.InsertOneAsync(loanApplication);
            return loanApplication;
        }

        public async Task UpdateAsync(string id, LoanApplication loanApplication)
        {
            await _loanApplications.ReplaceOneAsync(l => l.Id == id, loanApplication);
        }

        public async Task DeleteAsync(string id)
        {
            await _loanApplications.DeleteOneAsync(l => l.Id == id);
        }

        public async Task<List<LoanApplication>> GetByStatusAsync(string status)
        {
            return await _loanApplications.Find(l => l.Status == status).ToListAsync();
        }
    }
}
