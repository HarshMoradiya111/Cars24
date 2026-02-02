using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24API.Models
{
    public class LoanApplication
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        public string? UserId { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("loanAmount")]
        public decimal LoanAmount { get; set; }

        [BsonElement("interestRate")]
        public decimal InterestRate { get; set; }

        [BsonElement("tenure")]
        public int Tenure { get; set; }

        [BsonElement("monthlyEMI")]
        public decimal MonthlyEMI { get; set; }

        [BsonElement("totalAmount")]
        public decimal TotalAmount { get; set; }

        [BsonElement("totalInterest")]
        public decimal TotalInterest { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = "Pending";

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("notes")]
        public string? Notes { get; set; }
    }
}
