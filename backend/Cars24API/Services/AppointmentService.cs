using Cars24API.Models;
using MongoDB.Driver;

namespace Cars24API.Services
{
    public class AppointmentService
    {
        private readonly IMongoCollection<Appointment> _appointment;
        public AppointmentService(IConfiguration config)
        {
            var connectionString = MongoConfig.GetConnectionString(config);
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new ArgumentException("MongoDB connection string is not configured. Set 'ConnectionStrings__Cars24DB' (recommended) or 'MONGODB_URI'.");

            var client = new MongoClient(connectionString);

            var database = client.GetDatabase(MongoConfig.GetDatabaseName(config));
            _appointment = database.GetCollection<Appointment>("Appointments");
        }
        public async Task CreateAsync(Appointment appointment)
        {
            await _appointment.InsertOneAsync(appointment);
        }

        public async Task<Appointment?> GetByIdAsynch(string id)
        {
            if (string.IsNullOrWhiteSpace(id) || !MongoDB.Bson.ObjectId.TryParse(id, out _))
                return null;

            return await _appointment.Find(a => a.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Appointment>> GetAllAsync()
        {
            return await _appointment.Find(_ => true).ToListAsync();
        }

        public async Task UpdateAsync(string id, Appointment appointment)
        {
            await _appointment.ReplaceOneAsync(a => a.Id == id, appointment);
        }
    }
}