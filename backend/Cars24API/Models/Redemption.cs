using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24API.Models;

public class Redemption
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public int PointsRedeemed { get; set; }
    public string RewardType { get; set; } = "Discount Voucher";
    public DateTime RedeemedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Completed";
}
