using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services
{
    public class ServiceBookingService
    {
        private readonly IMongoCollection<ServiceBooking> _serviceBookings;

        public ServiceBookingService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));
            var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
            _serviceBookings = database.GetCollection<ServiceBooking>("ServiceBookings");
        }

        public async Task CreateAsync(ServiceBooking booking)
        {
            await _serviceBookings.InsertOneAsync(booking);
        }

        public async Task<ServiceBooking?> GetByIdAsync(string id)
        {
            return await _serviceBookings.Find(sb => sb.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<ServiceBooking>> GetByUserIdAsync(string userId)
        {
            return await _serviceBookings.Find(sb => sb.UserId == userId).ToListAsync();
        }

        public async Task<List<ServiceBooking>> GetAllAsync()
        {
            return await _serviceBookings.Find(_ => true).ToListAsync();
        }
    }
}
