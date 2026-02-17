using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services
{
    public class BookingService
    {
        private readonly IMongoCollection<Booking> _bookings;
        public BookingService(IConfiguration config)
        {
            var connectionString = MongoConfig.GetConnectionString(config);
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new ArgumentException("MongoDB connection string is not configured. Set 'ConnectionStrings__Cars24DB' (recommended) or 'MONGODB_URI'.");

            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(MongoConfig.GetDatabaseName(config));
            _bookings = database.GetCollection<Booking>("Bookings");
        }
        public async Task CreateAsync(Booking booking)
        {
            await _bookings.InsertOneAsync(booking);
        }

        public async Task<Booking> GetByIdAsynch(string id)
        {
            return await _bookings.Find(a => a.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Booking>> GetAllAsync()
        {
            return await _bookings.Find(_ => true).ToListAsync();
        }
    }
}