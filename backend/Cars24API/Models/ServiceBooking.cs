using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24API.Models
{
    public class ServiceBooking
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public int ServicePrice { get; set; }
        public int DiscountUsed { get; set; }
        public int FinalPrice { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PreferredDate { get; set; } = string.Empty;
        public bool UseWallet { get; set; }
        public string Status { get; set; } = "Confirmed";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
